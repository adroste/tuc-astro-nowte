import React from 'react';
import PropTypes from 'prop-types';
import {Treebeard, decorators} from "react-treebeard"

// custom header decoration
decorators.Header = (props) => {

    const iconType = props.node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={props.style.base}>
            <div style={props.style.title}>
                <i className={iconClass} style={iconStyle}/>
                Thingy: {props.node.name}
            </div>
        </div>
    );
};

/**
 * this is a simple file tree
 */
export default class FileTree extends React.Component {
    /**
     * propTypes
     * label {string} title of the file tree
     * data {object} file structure
     */
    static get propTypes() {
        return {
            label: PropTypes.string.isRequired,
            data: PropTypes.object,
        };
    }

    static get defaultProps() {
        return {};
    }

    constructor(props)
    {
        super(props);

        this.state = {
            files: {
                name: 'root',
                toggled: true,
                children: [
                    {
                        name: 'folder1',
                        toggled: true,
                        children: [
                            {name: 'file2'}
                        ]
                    },
                    { name: 'file1' }
                ]
            }
        }
    }


    onToggle = (node, toggled) => {
        // disable the last element that was clicked
        if(this.state.cursor){
            this.state.cursor.active = false;
        }

        node.active = true;
        if(node.children){
            node.toggled = toggled;
        }
        this.setState({cursor: node});
    };

    render() {
        return (
            <div>
                <h3>{this.props.label}</h3>
                <Treebeard
                    data={this.props.data}
                    onToggle={this.onToggle}
                    decorators = {decorators}
                />
            </div>
        );
    }
}