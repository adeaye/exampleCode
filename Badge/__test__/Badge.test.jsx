import React from 'react';
import { render } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge Component test with snapshot', () => {
  it('renders with default variant', () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('renders with a warning variant', () => {
    const { container } = render(
      <Badge variant="warnings">Warning Badge</Badge>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with a success variant', () => {
    const { container } = render(
      <Badge variant="success">success Badge</Badge>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with a danger variant', () => {
    const { container } = render(<Badge variant="danger">danger Badge</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('renders with a info variant', () => {
    const { container } = render(<Badge variant="info">info Badge</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('renders with an icon', () => {
    const { container } = render(<Badge icon="Tb360">Badge with Icon</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom Class Badge</Badge>
    );
    expect(container).toMatchSnapshot();
  });
});
