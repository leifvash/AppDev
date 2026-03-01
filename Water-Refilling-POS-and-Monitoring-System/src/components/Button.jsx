import React from 'react';
import '../styles/components/Button.css';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  icon = null,
  className = '',
  ...props
}) => {
  const buttonClass = `btn btn--${variant} btn--${size} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
