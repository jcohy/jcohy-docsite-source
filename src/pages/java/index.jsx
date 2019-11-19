import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch'; // fetch polyfill
import Language from '../../components/language';
import Header from '../../components/header';
import Bar from '../../components/bar';
import Footer from '../../components/footer';
import javaConfig from '../../../site_config/java';
import { Menu, Icon } from 'antd';
import './index.scss';
import 'antd/dist/antd.css';

// 锚点正则
const { SubMenu } = Menu;
class SpringFramework extends Language {
  rootSubmenuKeys=[]
  rootSubOpenKeys = ['Java 8 新特性', 'Java 9 新特性', 'Java 10 新特性', 'Java 11 新特性', 'Java 12 新特性', 'Java 13 新特性'];
  constructor(props) {
    super(props);
    this.state = {
      __html: '/zh-cn/docs/java/java8/SUMMARY.html',
      openKeys: ['Java 8 新特性'],
      current:'Java 8 新特性',
    };
  }

  componentWillMount(){
    const language = this.getLanguage();
    const menuTreeNode = this.renderMenu(javaConfig[language].sidemenu);
    this.setState({
      menuTreeNode:menuTreeNode
    })
  }

  componentDidMount() {
    this.getHtml(this.state.__html)
  }

  renderMenu = (data)=>{
    return data.map((item)=>{
      if(item.children){//当有子集存在的时候，需要再次调用遍历
        this.rootSubmenuKeys.push(item.title);
        return (
            <SubMenu title={item.title} key={item.title}>
              {this.renderMenu(item.children)}
            </SubMenu>
        )
      }
      return (
          <Menu.Item title={item.link} key={item.title}>{item.title}</Menu.Item>
      )
    })
  };

  getHtml = (pathName) =>{
    fetch(pathName.replace(/\.html$/i, '.json'))
       .then(res => res.json())
       .then((md) => {
         this.setState({
           __html: md && md.__html ? md.__html : '',
         });
       });
  };

  handleClick = (e) => {
    this.setState({
      current: e.key,
      link: e.item.props.title,
      __html: this.getHtml(e.item.props.title)
    })
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubOpenKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  render() {
    const language = this.getLanguage();
    const dataSource = javaConfig[language];
    const __html = this.props.__html || this.state.__html;
    return (
      <div className="documentation-page">
        <Header
          currentKey="docs"
          type="normal"
          logo="/img/jcohy_colorful.png"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        <Bar img="/img/system/docs.png" text={dataSource.barText} />
        <section className="contents-section">
          <Menu
              onClick={this.handleClick}
              style={{  width: 350,display:'inline-block'   }}
              defaultSelectedKeys={[this.state.current]}
              onOpenChange={this.onOpenChange}
              openKeys={this.state.openKeys}
              mode="inline"
          >
            {this.state.menuTreeNode}
          </Menu>
          <div
              className="doc-content markdown-body"
                dangerouslySetInnerHTML={{ __html }}
          >
          </div>
        </section>
        <Footer logo="/img/jcohy.png" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<SpringFramework />, document.getElementById('root'));

export default SpringFramework;
