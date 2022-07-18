import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { css } from "@emotion/react";

type ButtonProps = {
  variant?: string;
  onClick?: any | undefined;
  disabled?: boolean;
  loading?: boolean;
  children: JSX.Element | string;
  className?: string;
};

export const Button = ({
  variant,
  disabled,
  loading,
  onClick,
  children,
  ...rest
}: ButtonProps): JSX.Element => {
  const buttonVariants = {
    initial: { scale: 1, transition: { duration: 0.25 } },
    hover: { scale: 1.05, transition: { duration: 0.25 } },
    tap: { scale: 0.9, transition: { duration: 0.15 } },
  };

  const primaryStyle = () => css`
    border: 1px solid #ccc;

    &:hover {
      border: 1px solid #b43737;

      div {
        &:after,
        &:before {
          background-color: #b43737;
        }

        + p {
          &:before {
            background-color: #b43737;
          }
          color: #b43737;
        }
      }
    }
  `;

  const StyledButton = styled("button")`
    display: inline-block;
    background: #eee;
    padding: 0;
    color: #000;
    z-index: 100;
    font-size: 1rem;
    outline: none;
    position: relative;
    cursor: pointer;
    pointer-events: all;
    border-radius: 0.5rem;

    &[disabled],
    &[aria-disabled="true"] {
      background: #ccc;
      color: rgba(0, 0, 0, 0.5);
      cursor: auto;
      pointer-events: none;
      border: 0;
    }

    ${() => (!variant || variant === "primary") && primaryStyle}
  `;

  return (
    <motion.div
      css={{
        display: "inline-block",
        position: "relative",
        "&:focus": { outline: 0 },
      }}
      variants={!disabled ? buttonVariants : undefined}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onTap={onClick}
    >
      <StyledButton
        className="Button"
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        {children}
      </StyledButton>
    </motion.div>
  );
};
