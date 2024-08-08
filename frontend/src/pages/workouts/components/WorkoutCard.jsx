/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTheme } from '@emotion/react';
import { css } from '@emotion/react';

const WorkoutCard = ({ workoutName, workoutId, onClick, workoutDate }) => {
  const theme = useTheme();

  const cardStyle = css`
    width: 15rem;
    height: 16rem;
    margin: 1rem;
    border-radius: 0.8rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    display: flex;
    justify-content: center;
    align-items: end;
    background-color: ${theme.palette.secondary.background};
    transition: transform 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }
  `;

  const footerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    height: 8rem;
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.primary.contrastText};
    width: 100%;
    border-bottom-left-radius: 0.8rem;
    border-bottom-right-radius: 0.8rem;
  `;

  return (
    <div css={cardStyle} onClick={() => onClick(workoutId)}>
      <div css={footerStyle}>
        <p style={{ width: '100%', textAlign: 'center' }}>{workoutName}</p>
        <p style={{ width: '100%', textAlign: 'center' }}> {workoutDate}</p>
      </div>
    </div>
  );
};

export default WorkoutCard;
