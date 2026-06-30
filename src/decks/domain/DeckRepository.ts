import { Deck } from './Deck'
import { DeckId } from './DeckId'

export interface DeckRepository {
  findAll(): Promise<Deck[]>
  findById(id: DeckId): Promise<Deck | null>
  save(deck: Deck): Promise<void>
  delete(id: DeckId): Promise<void>
}
