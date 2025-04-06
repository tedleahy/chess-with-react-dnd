import { render, screen } from '@testing-library/react';
import Dialog from '../Dialog';
import { assertAccessible } from '../../test-utils/accessibility';

const DIALOG_HEADER_TEXT = 'Test Header Text';

describe('Dialog component', () => {
    test('Is rendered and visible when the "open" prop is true', () => {
        render(<Dialog open={true} header={DIALOG_HEADER_TEXT} />);
        expect(screen.getByRole('dialog')).toBeVisible();
    });

    test('Is not visible when the "open" prop is false', () => {
        render(<Dialog open={false} header={DIALOG_HEADER_TEXT} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('Displays the correct header text', () => {
        render(<Dialog open={true} header={DIALOG_HEADER_TEXT} />);
        expect(screen.getByText(DIALOG_HEADER_TEXT)).toBeVisible();
    });

    test('Renders children correctly', () => {
        render(
            <Dialog open={true} header={DIALOG_HEADER_TEXT}>
                <div data-testid="child">Child content</div>
            </Dialog>,
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    test("Applies default background colour when one isn't specified", () => {
        render(<Dialog open={true} header={DIALOG_HEADER_TEXT} />);
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveStyle('background-color: white');
    });

    test('Applies custom background colour when specified', () => {
        const customColor = 'red';
        render(<Dialog open={true} header={DIALOG_HEADER_TEXT} backgroundColor={customColor} />);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveStyle(`background-color: ${customColor}`);
    });

    test('Should have no accessibility violations', async () => {
        assertAccessible(
            <Dialog open={true} header={DIALOG_HEADER_TEXT}>
                Content
            </Dialog>,
        );
    });
});
