import React from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { getLink } from '../../../utils';
import ItemList from './itemlist';

@autobind
class Item extends React.Component {
    constructor(props) {
        super(props);
        const { item } = props;
        const hasChildren = item.children && item.children.length;
        let opened = props.item.opened;
        let childLength = 0;
        if (hasChildren) {
            if (opened === undefined) {
                // 未配置展开，则是否展开由是否选中决定
                opened = item.children.find(child => getLink(child.link) === window.location.pathname);
                childLength = item.children.length + 1
            }
        } else {
            opened = false;
        }
        this.state = {
            opened,
            childLength,
        };
    }

    onItemClick(e) {
        this.props.toggleMenuBody();
        e.stopPropagation();
    }

    toggle() {
        this.setState({
            opened: !this.state.opened,
        });
    }

    childLength(count){
        this.setState({
            childLength: this.state.childLength+count,
        });
    }

    render() {
        const { item } = this.props;
        const hasChildren = item.children && item.children.length;
        const { opened,childLength } = this.state;
        const cls = classnames({
            'menu-item': true,
            'menu-item-level-2': true,
            'menu-item-selected': getLink(item.link) === window.location.pathname,
        });
        const style = {
            height: opened ? 36 * childLength : 36,
            overflow: 'hidden',
        };
        if (hasChildren) {
            return (
                <li style={style} className={cls} onClick={this.toggle}>
                    {
                        <span>
            {item.title}
                            <img style={{ transform: `rotate(${opened ? 0 : -90}deg)` }} className="menu-toggle"
                                 src={getLink('/img/system/arrow_down.png')}/>
          </span>
                    }
                    <ul>
                        {item.children.map((itemList, j) => <ItemList itemList={itemList} key={j}  childLength={this.childLength} />)})}
                    </ul>
                </li>
            );
        }
        return (
            <li style={style} className={cls} onClick={this.onItemClick}>
                <a href={getLink(item.link)} target={item.target || '_self'}>{item.title}</a>
            </li>
        );
    }
}

export default Item;
