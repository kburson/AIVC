// Test-only bundle entry: actual product components, controlled VAD boundary via esbuild alias.
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import Conversation from '../../apps/web/components/Conversation';
import { installInterruptionDriver } from './interruption-driver';
installInterruptionDriver();
createRoot(document.getElementById('test-root')!).render(
  createElement(Conversation),
);
