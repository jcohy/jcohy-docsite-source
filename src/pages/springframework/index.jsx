import React from 'react';
import ReactDOM from 'react-dom';
import { scroller } from 'react-scroll';
import 'whatwg-fetch'; // fetch polyfill
import path from 'path';
import Language from '../../components/language';
import Header from '../../components/header';
import Bar from '../../components/bar';
import Footer from '../../components/footer';
import springConfig from '../../../site_config/springframework';
import { Menu, Icon } from 'antd';
import './index.scss';
import 'antd/dist/antd.css';
import classnames from 'classnames';
import { getLink } from '../../../utils';

// 锚点正则
const anchorReg = /^#[^/]/;
// 相对地址正则，包括./、../、直接文件夹名称开头、直接文件开头
const relativeReg = /^((\.{1,2}\/)|([\w-]+[/.]))/;
const { SubMenu } = Menu;
class Documentation extends Language {
  rootSubmenuKeys=[]
  constructor(props) {
    super(props);
    this.state = {
      __html: '',
      length: 2,
      openKeys: [],
    };
  }
  componentWillMount(){
    const language = this.getLanguage();
    const menuTreeNode = this.renderMenu(springConfig[language].sidemenu);
    this.setState({
      menuTreeNode:menuTreeNode
    })
  }

  // componentDidMount() {
  //   // 通过请求获取生成好的json数据，静态页和json文件在同一个目录下
  //   fetch(window.location.pathname.replace(/\.html$/i, '.json'))
  //   .then(res => res.json())
  //   .then((md) => {
  //     this.setState({
  //       __html: md && md.__html ? md.__html : '',
  //     });
  //   });
  //   this.markdownContainer.addEventListener('click', (e) => {
  //     const isAnchor = e.target.nodeName.toLowerCase() === 'a' && e.target.getAttribute('href') && anchorReg.test(e.target.getAttribute('href'));
  //     if (isAnchor) {
  //       e.preventDefault();
  //       const id = e.target.getAttribute('href').slice(1);
  //       scroller.scrollTo(id, {
  //         duration: 1000,
  //         smooth: 'easeInOutQuint',
  //       });
  //     }
  //   });
  // }

  componentDidUpdate() {
    this.handleRelativeLink();
    this.handleRelativeImg();
  }

  handleRelativeLink() {
    const language = this.getLanguage();
    // 获取当前文档所在文件系统中的路径
    // rootPath/en-us/docs/dir/hello.html => /docs/en-us/dir
    const splitPart = window.location.pathname.replace(`${window.rootPath}/${language}`, '').split('/').slice(0, -1);
    const filePath = splitPart.join('/');
    const alinks = Array.from(this.markdownContainer.querySelectorAll('a'));
    alinks.forEach((alink) => {
      const href = alink.getAttribute('href');
      if (relativeReg.test(href)) {
        // 文档之间有中英文之分，md的相对地址要转换为对应HTML的地址
        alink.href = `${path.join(`${window.rootPath}/${language}`, filePath, href.replace(/\.(md|markdown)$/, '.html'))}`;
      }
    });
  }

  handleRelativeImg() {
    const language = this.getLanguage();
    // 获取当前文档所在文件系统中的路径
    // rootPath/en-us/docs/dir/hello.html => /docs/en-us/dir
    const splitPart = window.location.pathname.replace(`${window.rootPath}/${language}`, '').split('/').slice(0, -1);
    splitPart.splice(2, 0, language);
    const filePath = splitPart.join('/');
    const imgs = Array.from(this.markdownContainer.querySelectorAll('img'));
    imgs.forEach((img) => {
      const src = img.getAttribute('src');
      if (relativeReg.test(src)) {
        // 图片无中英文之分
        img.src = `${path.join(window.rootPath, filePath, src)}`;
      }
    });
  }

  renderMenu = (data)=>{
    return data.map((item)=>{
      if(item.children){//当有子集存在的时候，需要再次调用遍历
        this.rootSubmenuKeys.push(item.key)
        return (
            <SubMenu title={item.title} key={item.key}>
              {this.renderMenu(item.children)}
            </SubMenu>
        )
      }
      return (
          <Menu.Item title={item.title} key={item.key}>{item.title}</Menu.Item>
      )
    })
  }
  render() {
    const language = this.getLanguage();
    const dataSource = springConfig[language].sidemenu;
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
              style={{  width: 350  }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
          >
            {this.state.menuTreeNode}
          </Menu>
          <div
            className="doc-content markdown-body"
            ref={(node) => { this.markdownContainer = node; }}
            dangerouslySetInnerHTML={{ __html }}
          />
        </section>
        <Footer logo="/img/jcohy.png" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Documentation />, document.getElementById('root'));

export default Documentation;
