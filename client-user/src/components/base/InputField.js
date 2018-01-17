/**
 * @author Alexander Droste
 * @date 16.01.18
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {COLOR_CODES, FONT_SIZES} from "../../Globals";


/**
 * Predefined input types
 * @see https://www.w3schools.com/tags/att_input_type.asp
 * @type {Object}
 */
export const INPUT_TYPES = {
    TEXT: 'text',
    EMAIL: 'email',
    NUMBER: 'number',
    PASSWORD: 'password',
};


const Wrapper = styled.div`
    display: block;
    margin: 15px 0;
`;


const LabelContainer = styled.div`
    text-align: left;
    font-size: ${FONT_SIZES.NORMAL};
    user-select: none;
    
    ${props => props.theme.label}
`;


const ChildrenContainer = styled.div`
    font-size: ${FONT_SIZES.NORMAL};

    ${props => props.theme.children}
`;


const Input = styled.input`
    display: block;
    width: 100%;
    font-size: ${FONT_SIZES.BIGGER};
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    
    &:focus {
        outline: none;
    }
    
    ${props => props.theme.input}
`;


export const greyTheme = {
    input: `
        border: 1px solid ${COLOR_CODES.GREY_LIGHT};
        transition: border-color 0.2s;
        
        &:focus {
            border-color: ${COLOR_CODES.GREY};
        }
    `,
    label: `
        color: ${COLOR_CODES.GREY_DARK};
    `,
};


export const errorTheme = {
    input: `
        border: 1px solid ${COLOR_CODES.RED_LIGHTER};
        transition: border-color 0.2s;
        
        &:focus {
            border-color: ${COLOR_CODES.GREY};
        }
    `,
    label: `
        color: ${COLOR_CODES.RED};
    `,
    children: `
        color: ${COLOR_CODES.RED_DARKER};
    `
};


// TODO green 'success' theme


export class InputField extends React.Component {
    /**
     * propTypes
     * @property {string} [label] text above the input box
     * @property {string} [name] name of the input box
     * @property {string} value value (text) of the input box
     * @property {function(text: string)} onInputChange callback when input box text was changed
     * @property {number} [maxLength=100] maximal character count
     * @property {string} [type=INPUT_TYPES.TEXT] type of the input box
     * @property {string} [placeholder] string that will be displayed in the background
     * @property {object} [theme] theme-template to apply
     */
    static get propTypes() {
        return {
            label: PropTypes.string,
            name: PropTypes.string,
            value: PropTypes.string.isRequired,
            onInputChange: PropTypes.func.isRequired,
            maxLength: PropTypes.number,
            type: PropTypes.string,
            placeholder: PropTypes.string,
            theme: PropTypes.object
        };
    }

    static get defaultProps() {
        return {
            maxLength: 100,
            type: INPUT_TYPES.TEXT,
            theme: greyTheme
        }
    }


    _onChangeHandler = (event) => {
        this.props.onInputChange(event.target.value);
    };


    render() {
        return (
            <Wrapper className={this.props.className}>
                {this.props.label &&
                    <LabelContainer
                        theme={this.props.theme}
                    >
                        {this.props.label}
                    </LabelContainer>
                }
                <Input
                    type={this.props.type}
                    name={this.props.name}
                    onChange={this._onChangeHandler}
                    maxLength={this.props.maxLength}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    theme={this.props.theme}
                />
                <ChildrenContainer
                    theme={this.props.theme}
                >
                    {this.props.children}
                </ChildrenContainer>
            </Wrapper>
        );
    }

}