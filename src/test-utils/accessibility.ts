import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

/**
 * Renders a component for accessibility violations using axe.
 * Throws an error if violations are found.
 *
 * @param element - The React element to render and test
 */
export async function assertAccessible(element: React.ReactElement) {
    const { container } = render(element);
    const results = await axe(container);

    expect.extend(toHaveNoViolations);
    expect(results).toHaveNoViolations();
}
