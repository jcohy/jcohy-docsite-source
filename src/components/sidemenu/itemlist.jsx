// import React from 'react';
// import { autobind } from 'core-decorators';
// import classnames from 'classnames';
// import { getLink } from '../../../utils';
//
// @autobind
// class ItemList extends React.Component {
//   constructor(props) {
//     super(props);
//     const { itemList } = props;
//     const hasChildren = itemList.children && itemList.children.length;
//     let subOpen = props.itemList.subOpen;
//
//     if (hasChildren) {
//       if (subOpen === undefined) {
//         // 未配置展开，则是否展开由是否选中决定
//         subOpen = itemList.children.find(child => getLink(child.link) === window.location.pathname);
//         this.props.childLength(itemList.children.length);
//       }
//     } else {
//       subOpen = false;
//     }
//     this.state = {
//       subOpen,
//     };
//   }
//
//   onSubItemClick(e) {
//     e.stopPropagation();
//   }
//
//   subToggle(e) {
//     const { itemList } = this.props;
//     this.setState({
//       subOpen: !this.state.subOpen,
//     });
//     if(!this.subOpen){
//       this.state.childLength = 0
//     }else{
//       this.props.childLength(itemList.children.length);
//     }
//     e.stopPropagation();
//   }
//
//   renderSubMenu(data) {
//
//     return (
//         <ul>
//           {
//             data.map((item, index) => (
//                 <li
//                     className={classnames({
//                       'menu-item': true,
//                       'menu-item-level-4': true,
//                       'menu-item-selected': getLink(item.link) === window.location.pathname,
//                     })}
//                     key={index}
//                     onClick={this.onSubItemClick}
//                 >
//                   <a href={getLink(item.link)} target={item.target || '_self'}>{item.title}</a>
//                 </li>
//             ))
//           }
//         </ul>
//     );
//   }
//
//   render() {
//     const { itemList } = this.props;
//     const hasChildren = itemList.children && itemList.children.length;
//     const { subOpen } = this.state;
//     const cls = classnames({
//       'menu-item': true,
//       'menu-item-level-3': true,
//       'menu-item-selected': getLink(itemList.link) === window.location.pathname,
//     });
//     const style = {
//       height: subOpen ? 36 * (itemList.children.length + 1) : 36,
//       overflow: 'hidden',
//     };
//     if (hasChildren) {
//       return (
//           <li style={style} className={cls} onClick={this.subToggle}>
//             {
//               <span>
//             {itemList.title}
//                 <img style={{ transform: `rotate(${subOpen ? 0 : -90}deg)` }} className="menu-toggle" src={getLink('/img/system/arrow_down.png')} />
//           </span>
//             }
//             {this.renderSubMenu(itemList.children)}
//           </li>
//       );
//     }
//     return (
//         <li style={style} className={cls} onClick={this.onSubItemClick}>
//           <a href={getLink(itemList.link)} target={itemList.target || '_self'}>{itemList.title}</a>
//         </li>
//     );
//   }
// }
//
// export default ItemList;
