'use client';
import { AppError } from '../shared/contracts';
import {
  parseTurn,
  validateSpeech,
  validateHistory,
  validateTurnEvent,
  validateCapabilities,
  validateProjectCatalog,
} from '../shared/validation';
import { retainPairs } from '../shared/history';
import { encodeSse, decodeSse, assertTurnSequence } from '../shared/sse';
export default function ContractProbe() {
  const operations = [
    AppError,
    parseTurn,
    validateSpeech,
    validateHistory,
    validateTurnEvent,
    validateCapabilities,
    validateProjectCatalog,
    retainPairs,
    encodeSse,
    decodeSse,
    assertTurnSequence,
  ];
  return (
    <p>
      Contract foundation:{' '}
      {operations.map((operation) => typeof operation).join(', ')}
    </p>
  );
}
