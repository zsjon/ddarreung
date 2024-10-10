import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin-right: 10px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #4caf50;
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  cursor: pointer;
  transition: 0.4s;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
`;

const ToggleText = styled.span`
  font-size: 16px;
`;

const Toggle = ({ isChecked, onChange, labelOn, labelOff }) => {
    return (
        <ToggleWrapper>
            <ToggleLabel>
                <ToggleInput type="checkbox" checked={isChecked} onChange={onChange} />
                <ToggleSlider />
            </ToggleLabel>
            <ToggleText>{isChecked ? labelOn : labelOff}</ToggleText>
        </ToggleWrapper>
    );
};

export default Toggle;
