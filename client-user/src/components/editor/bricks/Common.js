import styled from 'styled-components';
import { COLOR_CODES } from '../../../Globals';


export const BrickWrapper = styled.div.attrs({
    style: ({width, height}) => ({
        width: width + 'px',
        height: height ? (height + 'px') : 'auto'
    })
})`
    position: relative;
    overflow: hidden;
    
    &:focus {
        outline: none;
    }
    
    &:after { 
        content: '' ; 
        display: block ; 
        position: absolute ; 
        top: 0 ; 
        bottom: 0 ; 
        left: 0 ; 
        right: 0 ; 
        border-radius: 5px ; 
        border: 1px transparent solid; 
        transition: border 0.2s;
        pointer-events: none;
    }
    
    &:hover:after {
        border-color: rgba(0, 0, 0, 0.1);
    }
    
    &:focus:after {
        border-color: rgba(0, 0, 0, 0.5);
        outline: none;
    }
`;
