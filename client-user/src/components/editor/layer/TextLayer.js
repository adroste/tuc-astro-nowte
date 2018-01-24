import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {LayerWrapper} from './Common';
import throttle from 'lodash/throttle';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';

const StyledEditor = styled(Editor)`
    width: 100%;
    height: 100%;
`;


export class TextLayer extends React.Component {
    /**
     * propTypes
     * @property {function(string)} onChange indicates that the text was changed by the user
     * @property {string} text text that should be displayed in the editor
     */
    static get propTypes() {
        return {
            onChange: PropTypes.func.isRequired,
            text: PropTypes.string.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    constructor(props) {
        super(props);


        const initialValue = Value.fromJSON({
            document: {
              nodes: [
                {
                  object: 'block',
                  type: 'paragraph',
                  nodes: [
                    {
                      object: 'text',
                      leaves: [
                        {
                          text: ''
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          });

        this._value = initialValue;
        this._prevContent = "";
        this.state = {
            value: initialValue
        };
    }


    handleChange = (change) => {
        const content = Plain.serialize(change.value);
        if(content !== this._prevContent) {
            this._prevContent = content;
            this.props.onChange(content);
        }
        //} else {
            this.setState({
                value: change.value,
            });
        //}
    };



    componentWillReceiveProps(nextProps) {
        if(nextProps.text !== this.props.text){
            // update state
            if(nextProps.text === this._prevContent){
                // text is already there (local update )
                return;
            }

            const serValue = Plain.deserialize(nextProps.text);
            this._prevContent = nextProps.text;
            
            this.setState({
                value: serValue,
            });
        }
    }

    getValue = () => {

        return this.state.value;
    };

    render() {
        return (
            <LayerWrapper className={this.props.className}>
                <StyledEditor
                    value={this.getValue()}
                    onChange={this.handleChange}
                />
            </LayerWrapper>
        );
    }
}