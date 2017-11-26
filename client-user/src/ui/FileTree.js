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
            onFolderLoad: PropTypes.func,
            onFileLoad: PropTypes.func,
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
        let isFolder = false;
        if(node.children){
            node.toggled = toggled;
            isFolder = true;
        }
        this.setState({cursor: node});

        if(this.props.onFolderLoad && isFolder && toggled)
            this.props.onFolderLoad(node);

        if(this.props.onFileLoad && !isFolder)
            this.props.onFileLoad(node);
    };

    render() {
        return (
            <div>
                <h3>{this.props.label}</h3>
                <Treebeard
                    data={this.props.data}
                    onToggle={this.onToggle}
                    decorators = {decorators}
                    style = {styles}
                />
            </div>
        );
    }
}


// styles
const styles = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '#fff',
            margin: 0,
            padding: 0,
            color: '#9DA5AB',
            fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
            fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#31363F'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#9DA5AB'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
};