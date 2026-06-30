import { useState } from "react";
import { Dialog, DialogContent, Button, useMediaQuery } from "@mui/material";
import { Deck } from "@/decks/domain/Deck";
import { Card } from "@/decks/domain/Card";
import { Results } from "./Results";
import { SessionHeader } from "./SessionHeader";
import { FlipCard } from "./FlipCard";
import { SessionActions } from "./SessionActions";

interface Props {
  open: boolean;
  deck: Deck;
  cards: Card[];
  onRecordResult: (cardId: string, result: "correct" | "incorrect") => void;
  onComplete: () => void;
  onClose: () => void;
}

export function StudySessionView({
  open,
  deck,
  cards,
  onRecordResult,
  onComplete,
  onClose,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 899px)");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [localCorrect, setLocalCorrect] = useState(0);
  const [localIncorrect, setLocalIncorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const current = cards[currentIndex];
  const isLast = currentIndex === cards.length - 1;
  const progress = (answered.size / cards.length) * 100;
  const totalAnswered = localCorrect + localIncorrect;
  const accuracy =
    totalAnswered > 0 ? Math.round((localCorrect / totalAnswered) * 100) : 0;

  function handleRate(result: "correct" | "incorrect") {
    onRecordResult(current.id.value, result);

    const newCorrect = result === "correct" ? localCorrect + 1 : localCorrect;
    const newIncorrect =
      result === "incorrect" ? localIncorrect + 1 : localIncorrect;
    const newStreak = result === "correct" ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);

    setLocalCorrect(newCorrect);
    setLocalIncorrect(newIncorrect);
    setStreak(newStreak);
    setMaxStreak(newMaxStreak);
    setAnswered((prev) => new Set(prev).add(currentIndex));
    setRevealed(false);

    if (isLast) {
      setShowResults(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleDone() {
    setShowResults(false);
    onComplete();
  }

  function handleClose() {
    setCurrentIndex(0);
    setRevealed(false);
    setAnswered(new Set());
    setLocalCorrect(0);
    setLocalIncorrect(0);
    setStreak(0);
    setMaxStreak(0);
    setShowResults(false);
    onClose();
  }

  const resultMessage =
    accuracy >= 90
      ? "Outstanding!"
      : accuracy >= 70
        ? "Great work!"
        : accuracy >= 50
          ? "Good effort, keep going!"
          : "Practice makes perfect.";

  if (showResults) {
    return (
      <Results
        open={showResults}
        onClose={handleClose}
        resultMessage={resultMessage}
        localCorrect={localCorrect}
        accuracy={accuracy}
        maxStreak={maxStreak}
        handleDone={handleDone}
        isMobile={isMobile}
      />
    );
  }

  if (!current) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
    >
      <SessionHeader
        deckName={deck.name}
        currentIndex={currentIndex}
        total={cards.length}
        streak={streak}
        localCorrect={localCorrect}
        localIncorrect={localIncorrect}
        progress={progress}
        isMobile={isMobile}
        onClose={handleClose}
      />

      <DialogContent
        sx={{ pt: 2, pb: 2, display: "flex", flexDirection: "column" }}
      >
        <FlipCard
          question={current.question}
          answer={current.answer}
          revealed={revealed}
          isMobile={isMobile}
          onReveal={() => setRevealed(true)}
        />

        {!revealed && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setRevealed(true)}
            size={isMobile ? "large" : "medium"}
            sx={{ mt: 2, py: isMobile ? 1.5 : undefined }}
          >
            Reveal Answer
          </Button>
        )}
      </DialogContent>

      <SessionActions
        revealed={revealed}
        isMobile={isMobile}
        onClose={handleClose}
        onRate={handleRate}
      />
    </Dialog>
  );
}
