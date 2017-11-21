import React from 'react';
import PropTypes from 'prop-types';
import {Treebeard, decorators} from "react-treebeard"

// custom header decoration
decorators.Header = ({style, node}) => {

    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>
                Thingy: {node.name}
            </div>
        </div>
    );
};

export default class FileTree extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {};
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
                <h2>MyFiles</h2>
                <Treebeard
                    data={this.state.files}
                    onToggle={this.onToggle}
                    decorators = {decorators}
                />
            </div>
        );
    }
}