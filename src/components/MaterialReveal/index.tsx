import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import MaterialRevealProps from './interface';

import styled from 'styled-components';

const StyledDiv = styled.div`
  position: relative;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  overflow: hidden;

  &.variant--success {
    background-color: #1b5e20;
    color: #fefefe;
  }

  &.variant--info {
    background-color: #0d47a1;
    color: #fefefe;
  }

  &.variant--warn {
    background-color: #b71c1c;
    color: #fefefe;
  }

  & .material-reveal__options {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: currentColor;

    & span {
      padding: 0 0.25em;

      & button {
        cursor: pointer;
        color: currentColor;
        padding: 1em;
        margin: 0;
        margin-right: 0.25em;
        border: 0;
        border-radius: 50%;
        background-color: transparent;

        & > svg {
          height: 2em;
          width: 2em;
          fill: currentColor;
        }

        &:hover,
        &:focus {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &:active {
          background-color: rgba(255, 255, 255, 0.15);
        }

        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }

  & .material-reveal__outline {
    content: '';
    z-index: 2;
    border-radius: 4px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px #fefefe, inset 0 0 0 3px #01579b, inset 0 0 0 4px #fefefe;
    opacity: 0;
  }

  & .material-reveal__info {
    z-index: 1;
    width: 100%;
    position: relative;
    border: 0;
    margin: 0;
    border-radius: 0;
    text-align: left;
    will-change: transform;
    font-size: 16px;
    cursor: grab;
    background-color: #fefefe;
    user-select: none;
    padding: 0.8em 1em;
    transition-property: transform;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    @supports not (-ms-high-contrast: none) {
      &:focus {
        outline: none;

        & ~ .material-reveal__outline {
          opacity: 1;
        }
      }

      @supports selector(:focus-visible) {
        &:focus:not(:focus-visible) {
          & ~ .material-reveal__outline {
            opacity: 0;
          }
        }
      }
    }
  }

  &.internal--user-control {
    & .material-reveal__info {
      transition: none;
      cursor: grabbing;
    }
  }

  &:not(.internal--user-control) {
    & .material-reveal__info {
      &:hover {
        transform: translateX(-5px);
      }
    }
  }
`;

export default function MaterialReveal({ className, variant, actions, children }: MaterialRevealProps) {
  const [classList, setClassList] = useState(['material-reveal']);

  // main states
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLast, setIsOpenLast] = useState(false);
  const [startPos, setStartPos] = useState<null | number>(null);

  // element refs
  const infoPanel = useRef<HTMLButtonElement>(null);
  const buttonPanel = useRef<HTMLElement>(null);

  // set up classes
  useEffect(() => {
    const _classList = ['material-reveal'];
    if (Array.isArray(className)) {
      _classList.push(...className);
    } else {
      for (let c of className.split(' ')) {
        _classList.push(c);
      }
    }

    if (Array.isArray(variant)) {
      _classList.push(...variant.map((v) => `variant--${v}`));
    } else {
      for (let v of variant.split(' ')) {
        if (v) _classList.push(`variant--${v}`);
      }
    }

    if (isActive) _classList.push('internal--user-control');

    setClassList(_classList);
  }, [className, isActive, variant]);

  // Add event listener
  useEffect(() => {
    const { current: info } = infoPanel;

    if (info === null) return;

    // when mouse is down set contol class and mark as active
    const onMouseDown = ({ clientX }: MouseEvent | Touch) => {
      setIsActive(true);
      setStartPos(clientX);
    };

    // if active calculate new position of card
    const onMouseMove = ({ clientX }: MouseEvent | Touch) => {
      if (!isActive || startPos === null) return;

      const { current: buttons } = buttonPanel;
      const { current: info } = infoPanel;

      if (buttons === null || info === null) return;

      const buttonsWidth = buttons.offsetWidth;

      const offset = isOpenLast ? clientX - startPos - buttonsWidth : clientX - startPos;

      if (offset > 0) return;

      setIsOpen(buttonsWidth < Math.abs(offset));

      info.style.transform = `translatex(${offset}px)`;
    };

    // on release animate card to correct position
    const updateState = (setopen?: boolean) => {
      const { current: buttons } = buttonPanel;
      const { current: info } = infoPanel;

      if (buttons === null || info === null) return;

      const open = setopen === undefined ? isOpen : setopen;

      setIsActive(false);
      setStartPos(null);
      setIsOpenLast(open);
      setIsOpen(open);
      info.style.transform = open ? `translatex(-${buttons.offsetWidth}px)` : '';
      info.setAttribute('aria-expanded', open.toString());
      info.setAttribute('aria-hidden', (!open).toString());

      buttons.querySelectorAll('button').forEach((button) => {
        if (open) {
          button.removeAttribute('disabled');
        } else {
          button.setAttribute('disabled', '');
        }
      });
    };

    // function to pass to update state without event info
    const callUpdateState = () => {
      updateState();
    };

    // keyboard interactions with cards
    const onKeyUp = ({ code, target }: KeyboardEvent) => {
      const { current: info } = infoPanel;

      if (['Space', 'Enter'].indexOf(code) < 0 || target !== info) return;
      updateState(!isOpen);
    };

    // keyboard interactions with cards
    const onDoubleClick = () => {
      updateState(!isOpen);
    };

    // convert touch event to mouse down
    const convertMouseDown = ({ touches }: TouchEvent) => {
      onMouseDown(touches[0]);
    };

    // convert touch event to mouse move
    const convertMouseMove = ({ touches }: TouchEvent) => {
      onMouseMove(touches[0]);
    };

    // keyboard listeners
    info.addEventListener('keyup', onKeyUp);

    // mouse listeners
    info.addEventListener('dblclick', onDoubleClick);
    info.addEventListener('mousedown', onMouseDown);
    document.body.addEventListener('mouseup', callUpdateState);
    document.body.addEventListener('mouseleave', callUpdateState);
    document.body.addEventListener('mousemove', onMouseMove);

    // touch listeners
    info.addEventListener('touchstart', (e) => convertMouseDown);
    document.body.addEventListener('touchend', callUpdateState);
    document.body.addEventListener('touchcancel', callUpdateState);
    document.body.addEventListener('touchmove', (e) => convertMouseMove);

    return () => {
      // keyboard listeners
      info.removeEventListener('keyup', onKeyUp);

      // mouse listeners
      info.removeEventListener('dblclick', onDoubleClick);
      info.removeEventListener('mousedown', onMouseDown);
      document.body.removeEventListener('mouseup', callUpdateState);
      document.body.removeEventListener('mouseleave', callUpdateState);
      document.body.removeEventListener('mousemove', onMouseMove);

      // touch listeners
      info.removeEventListener('touchstart', (e) => convertMouseDown);
      document.body.removeEventListener('touchend', callUpdateState);
      document.body.removeEventListener('touchcancel', callUpdateState);
      document.body.removeEventListener('touchmove', (e) => convertMouseMove);
    };
  }, [isActive, isOpen, isOpenLast, startPos]);

  return (
    <StyledDiv className={classList.join(' ')}>
      <button ref={infoPanel} className="material-reveal__info" aria-expanded="false">
        {children}
      </button>
      <div className="material-reveal__options">
        <span ref={buttonPanel}>
          {actions.map((action) => (
            <button title={action.title} aria-label={action.title} onClick={() => action.action}>
              {action.icon}
            </button>
          ))}
        </span>
      </div>
      <div className="material-reveal__outline"></div>
    </StyledDiv>
  );
}

MaterialReveal.propTypes = {
  /** className string - classes to be added to button */
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  /** variant string - variants to be added to the button */
  variant: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  /** actions array - actions to be hidden behind the slider */
  actions: PropTypes.array,
};

MaterialReveal.defaultProps = {
  className: [],
  variant: [],
  actions: [],
};
