import React from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { getLink } from '../../../utils';

@autobind
class SubMenu extends React.Component {
  constructor(props) {
    super(props);
    const { submenu } = props;
    const hasChildren = submenu.children && submenu.children.length;
    let isOpen = props.submenu.opened;
    if (hasChildren) {
      if (isOpen === undefined) {
        // 未配置展开，则是否展开由是否选中决定
        isOpen = submenu.children.find(child => getLink(child.link) === window.location.pathname);
      }
    } else {
      isOpen = false;
    }
    this.state = {
      isOpen,
    };
  }

  onItemClick(e) {
    this.props.toggleMenuBody();
    e.stopPropagation();
  }

  subToggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  renderSubMenu(data) {
    return (
      <ul>
      {
        data.map((item, index) => (
          <li
            className={classnames({
              'menu-item': true,
              'menu-item-level-4': true,
              'menu-item-selected': getLink(item.link) === window.location.pathname,
            })}
            key={index}
            onClick={this.onItemClick}
          >
            <a href={getLink(item.link)} target={item.target || '_self'}>{item.title}</a>
          </li>
        ))
      }
      </ul>
    );
  }

  render() {
    const { submenu } = this.props;
    const hasChildren = submenu.children && submenu.children.length;
    const { isOpen } = this.state;
    const cls = classnames({
      'menu-item': true,
      'menu-item-level-3': true,
      'menu-item-selected': getLink(submenu.link) === window.location.pathname,
    });
    const style = {
      height: isOpen ? 36 * (submenu.children.length + 1) : 36,
      overflow: 'hidden',
    };
    if (hasChildren) {
      return (
        <li style={style} className={cls} onClick={this.subToggle}>
        {
          <span>
            {submenu.title}
            <img style={{ transform: `rotate(${isOpen ? 0 : -90}deg)` }} className="menu-toggle" src={getLink('/img/system/arrow_down.png')} />
          </span>
        }
        {this.renderSubMenu(submenu.children)}
        </li>
      );
    }
    return (
      <li style={style} className={cls} onClick={this.onItemClick}>
        <a href={getLink(submenu.link)} target={submenu.target || '_self'}>{submenu.title}</a>
      </li>
    );
  }
}

export default SubMenu;
