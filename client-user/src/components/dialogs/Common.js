/**
 * @author Alexander Droste
 * @date 15.01.18
 */
import styled from 'styled-components';
import {Heading2} from "../base/Common";


// ------------------
// enum definitions
// ------------------
export const DialogResultEnum = Object.freeze({
    CANCEL_NO: 0,
    OK_YES: 1,
});


export const DialogButtonsEnum = Object.freeze({
    OK: 0,
    YES_NO: 1,
});


// ------------------
// styled components
// ------------------
export const DialogButtonsContainer = styled.div`
    text-align: right;
    margin-top: 15px;
`;


export const DialogHeading = Heading2.extend`
    margin-top: 0;
`;


export const DialogMainContent = styled.div`
    margin: 25px;
`;