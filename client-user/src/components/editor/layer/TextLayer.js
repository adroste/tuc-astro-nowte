import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {LayerWrapper} from './Common';
import throttle from 'lodash/throttle';
import { Editor } from 'slate-react';
import { Value } from 'slate';


const StyledEditor = styled(Editor)`
    width: 100%;
    height: 100%;
`;


export class TextLayer extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
            onChange: PropTypes.func.isRequired
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
                          text: 'A line of text in a paragraph.'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          });


        this.state = {
            value: initialValue
        };
    }


    handleChange = ({value}) => {
        this.setState({ value });
    };


    render() {
        return (
            <LayerWrapper className={this.props.className}>
                <StyledEditor
                    value={this.state.value}
                    onChange={this.handleChange}
                />
            </LayerWrapper>
        );
    }
}