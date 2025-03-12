import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Bookings from '../../pages/user/Bookings';
import { getUserBookings } from '../../hooks/BookingHooks';

vi.mock('../../hooks/BookingHooks', () => ({
    getUserBookings: vi.fn(),
}));

describe('Bookings Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render loading state initially', () => {
        render(<Bookings />);
        expect(screen.getByText('Loading your bookings...')).toBeInTheDocument();
    });

    it('should render bookings when data is fetched successfully', async () => {
        const mockBookings = {
            informations: {
                bookings: [
                    {
                        _id: '1',
                        hotel: { name: 'Hotel A', picture_list: ['image1.jpg'] },
                        hotelRoom: { type: 'Deluxe' },
                        guests: 2,
                        status: 'CONFIRMED',
                        checkInDate: '2024-01-10T10:00:00.000Z',
                        checkOutDate: '2024-01-15T12:00:00.000Z',
                        totalPrice: 200,
                        isPaid: true,
                    },
                    {
                        _id: '2',
                        hotel: { name: 'Hotel B', picture_list: ['image2.jpg'] },
                        hotelRoom: { type: 'Suite' },
                        guests: 1,
                        status: 'PENDING',
                        checkInDate: '2024-02-05T14:00:00.000Z',
                        checkOutDate: '2024-02-10T11:00:00.000Z',
                        totalPrice: 150,
                        isPaid: false,
                    },
                ],
            },
        };

        getUserBookings.mockResolvedValue(mockBookings);
        render(<Bookings />);

        await waitFor(() => {
            expect(screen.getByText('Hotel A')).toBeInTheDocument();
            expect(screen.getByText('Hotel B')).toBeInTheDocument();
            expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
            expect(screen.getByText('PENDING')).toBeInTheDocument();
        });
    });

    it('should render error message when fetch fails', async () => {
        getUserBookings.mockRejectedValue(new Error('Failed to fetch bookings'));
        render(<Bookings />);

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText('Failed to fetch bookings')).toBeInTheDocument();
        });
    });

    it('should render "no bookings" message when there are no bookings', async () => {
        getUserBookings.mockResolvedValue({ informations: { bookings: [] } });
        render(<Bookings />);

        await waitFor(() => {
            expect(screen.getByText('You don\'t have any bookings yet')).toBeInTheDocument();
        });
    });
});