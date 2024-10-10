import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px
`;

const ToggleLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 350px;
  height: 60px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #4BC0C0;
  }
  
  &:checked + span:before {
    transform: translateX(166px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #C04BC0;
  border-radius: 34px;
  cursor: pointer;
  transition: 0.4s;
  z-index: 2;
  
  &:before {
    position: absolute;
    content: "";
    width: 170px;
    height: 46px;
    left: 6px;
    bottom: 7px;
    background-color: white;
    border-radius: 34px;
    transition: 0.4s;
  }
`;

const ToggleText1 = styled.span`
  position: relative;
  font-size: 20px;
  top : 14px;
  right : 28px;
  z-index: 3;
`;

const ToggleText2 = styled.span`
  position: relative;
  font-size: 20px;
  top : 14px;
  left : 28px;
  z-index: 3;
`;

const Toggle = ({ isChecked, onChange, labelOn, labelOff }) => {
    return (
        <ToggleWrapper>
            <ToggleLabel>
                <ToggleInput type="checkbox" checked={isChecked} onChange={onChange} />
                <ToggleSlider />
                <ToggleText1>{labelOn}</ToggleText1>
                <ToggleText2>{labelOff}</ToggleText2>
            </ToggleLabel>
        </ToggleWrapper>
    );
};

export default Toggle;
