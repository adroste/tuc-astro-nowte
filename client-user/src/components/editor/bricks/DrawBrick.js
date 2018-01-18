/**
 * @author Alexander Droste
 * @date 10.01.18
 */

import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import {DrawLayer} from "../layer/DrawLayer";


const BrickWrapper = styled.div`
    position: relative;
    width: ${props => props.widthCm}cm;
    height: ${props => props.heightPx}px;
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
        border-color: #ddd;
    }
    
    &:focus:after {
        border-color: #999;
        outline: none;
    }
`;


export class DrawBrick extends React.Component {
    /**
     * propTypes
     * @property {number} width width as css unit cm, e.g. 17 => "17cm"
     * @property {number} height height as css unit px, e.g. 100 => "100px"
     * @property {array} paths temporary user paths that are currently drawn. wrapped with {id: number, path: Path}
     * @property {array} splines finished splines. wrapped with {id: number, spline: Spline}
     *
     * @property {function()} onPathBegin indicates the start of a user drawn path
     * @property {function(Point)} onPathPoint indicates the addition of a new point to the current path
     * @property {function()} onPathEnd indicates that the user finished drawing
     */
    static get propTypes() {
        return {
            widthCm: PropTypes.number.isRequired,
            heightPx: PropTypes.number.isRequired,
            paths: PropTypes.array.isRequired,
            splines: PropTypes.array.isRequired,

            onPathBegin: PropTypes.func.isRequired,
            onPathPoint: PropTypes.func.isRequired,
            onPathEnd: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    render() {
        return (
            <BrickWrapper
                innerRef={ref => this.wrapperRef = ref}
                className={this.props.className}
                widthCm={this.props.widthCm}
                heightPx={this.props.heightPx}
                tabIndex="0"
                onClick={() => {
                    this.wrapperRef.focus();
                    // this.wrapperRef.scrollIntoView({
                    //     behavior: "smooth"
                    // });
                    //const rect = this.wrapperRef.getBoundingClientRect();
                    //alert(rect.top);
                    //window.scrollBy(rect.left / 2, rect.top - (window.innerHeight / 2));
                }}
            >
                <DrawLayer
                    socket={this.props.socket}
                    paths={this.props.paths}
                    splines={this.props.splines}

                    onPathBegin={this.props.onPathBegin}
                    onPathPoint={this.props.onPathPoint}
                    onPathEnd={this.props.onPathEnd}
                />
            </BrickWrapper>
        );
    }
}