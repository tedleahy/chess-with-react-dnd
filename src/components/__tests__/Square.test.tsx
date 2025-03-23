import { render, screen } from '@testing-library/react';
import Square from '../Square';

describe('Square Component', () => {
    for (const color of ['white', 'black']) {
        test(`renders ${color} square with the correct background color`, () => {
            render(<Square color={color}>{color} square</Square>);
            const squareElement = screen.getByText(`${color} square`);

            expect(squareElement).toHaveStyle({ backgroundColor: color });
        });
    }

    test('renders children correctly', () => {
        render(
            <Square color="white">
                <div data-testid="child">Child content</div>
            </Square>,
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });
});
