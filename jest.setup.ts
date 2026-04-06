import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

process.env.ADMIN_PASSWORD = 'test-password-123';

import '@testing-library/jest-dom';
