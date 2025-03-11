import {render} from '@testing-library/react';
import {describe, it, vi} from 'vitest';
import Reservation from '../../pages/common/Reservation';
import {BrowserRouter as Router} from 'react-router-dom';

vi.mock('../../hooks/UserHooks', () => ({
    getUserData: vi.fn(),
}));

describe('Reservation Component', () => {
    it('should render without crashing', () => {
        render(<Reservation />, {wrapper: Router});
    });

});