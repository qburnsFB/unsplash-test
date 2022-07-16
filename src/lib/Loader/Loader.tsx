import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { VERSUS_COLOR_PRIMARY, VERSUS_COLOR_SECONDARY } from "@/lib/constants";

type LoaderType = {
  size?: string;
  color?: string;
  bounceColor?: string;
};

export const Loader = ({
  size = "1.25rem",
  color = VERSUS_COLOR_PRIMARY,
  bounceColor = VERSUS_COLOR_SECONDARY,
  ...rest
}: LoaderType) => {
  const Bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  } 20% {
      background-color: ${bounceColor};
    } 40% {
      transform: scale(1.0);
      background-color: ${color};
    }
`;

  const StyledDotsLoader = styled.div`
    display: inline-block;
  `;

  const Dot = styled.span`
    width: ${() => size};
    height: ${() => size};
    background-color: ${() => color};
    display: inline-block;
    animation: ${Bounce} 1s infinite ease-in-out both;
    &:first-of-type {
      animation-delay: -0.4s;
    }

    &:nth-of-type(2) {
      animation-delay: -0.2s;
    }
  `;
  return (
    <StyledDotsLoader {...rest}>
      <Dot />
      <Dot />
      <Dot />
    </StyledDotsLoader>
  );
};
