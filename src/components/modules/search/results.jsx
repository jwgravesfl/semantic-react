import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import Content from './../../elements/simple/content';
import DefaultProps from '../../defaultProps';

export default class Results extends React.Component {
    static propTypes = {
        ...DefaultProps.propTypes,
        emptyHeader: React.PropTypes.string,
        emptyMessage: React.PropTypes.string,
        onSearchClick: React.PropTypes.func,
        results: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        search: React.PropTypes.string,
        style: React.PropTypes.object
    };

    static defaultProps = {
        ...DefaultProps.defaultProps,
        emptyHeader: 'No Results',
        emptyMessage: 'Your search returned no results'
    };

    /* eslint-disable */
    static Components = {
        Content: Content
    };
    /* eslint-enable */

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    onClick(child, e) {
        this.props.onSearchClick(e, child);
    }

    renderChildren() {
        if (this.props.results.length === 0) {
            return this.renderEmpty();
        } else if (Array.isArray(this.props.results)) {
            return this.renderArray();
        } else if (typeof this.props.results === 'object') {
            return this.renderObject();
        } else {
            return false;
        }
    }

    renderArray(results) {
        results = results || this.props.results;
        
        return results.map((child, key) => {
            let description = null;
            let title = typeof child === 'object' ? child.title : child;

            // use title and description
            if (typeof child === 'object' && child.description) {
                description = (
                    <div className="description">
                        {child.description}
                    </div>
                );
            }

            return (
                <a className="result"
                   key={key}
                   onMouseDown={this.onClick.bind(this, title)}
                >
                    <Results.Components.Content>
                        <div className="title">
                            {title}
                        </div>
                        {description}
                    </Results.Components.Content>
                </a>
            )
        });
    }

    renderObject() {
        let children = [];

        Object.keys(this.props.results).map(child => {
            children.push(
                <div className="category">
                    <div className="name">{child}</div>
                    {this.renderArray(this.props.results[child])}
                </div>
            );
        });

        return children;
    }

    renderEmpty() {
        return (
            <div className="message empty">
                <div className="header">{this.props.emptyHeader}</div>
                <div className="description">{this.props.emptyMessage}</div>
            </div>
        );
    }

    render() {
        /* eslint-disable no-use-before-define */
        let { children, className, component, defaultClasses, emptyHeader,
              emptyMessage, onSearchClick, results, search, style,
              ...other } = this.props;
        /* eslint-enable no-use-before-define */

        other.className = classNames(this.props.className, this.getClasses());
        other.style = this.props.style;

        return React.createElement(
            this.props.component,
            other,
            this.renderChildren()
        );
    }

    getClasses() {
        return {
            results: this.props.defaultClasses,

            transition: this.props.defaultClasses,
            visible: this.props.defaultClasses
        }
    }

}
