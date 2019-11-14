import React from 'react';
import { scroller } from 'react-scroll';
import 'whatwg-fetch'; // fetch polyfill
import path from 'path';
import './index.scss';
import { autobind } from 'core-decorators';
import cookie from 'js-cookie';
import siteConfig from '../../../site_config/site';

// 锚点正则
const anchorReg = /^#[^/]/;
// 相对地址正则，包括./、../、直接文件夹名称开头、直接文件开头
const relativeReg = /^((\.{1,2}\/)|([\w-]+[/.]))/;
@autobind
class DocsItem extends React.Component {

  constructor(props) {
    super(props);
    console.log(props.link)
    this.state = {
      __html: '',
      link: props.link,
    };
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      link: nextProps.link
    })
  }
  componentDidMount() {
    const pathName = this.state.link === ''|| this.state.link === undefined ?window.location.pathname:this.state.link
    console.log(pathName)
    // 通过请求获取生成好的json数据，静态页和json文件在同一个目录下
    fetch(pathName.replace(/\.html$/i, '.json'))
        .then(res => res.json())
        .then((md) => {
          this.setState({
            __html: md && md.__html ? md.__html : '',
          });
        });
    this.markdownContainer.addEventListener('click', (e) => {
      const isAnchor = e.target.nodeName.toLowerCase() === 'a' && e.target.getAttribute('href') && anchorReg.test(e.target.getAttribute('href')) || e.target.nodeName.toLowerCase() === 'li';
      if (isAnchor) {
        e.preventDefault();
        const id = e.target.getAttribute('href').slice(1);
        scroller.scrollTo(id, {
          duration: 1000,
          smooth: 'easeInOutQuint',
        });
      }
    });
  }

  getLanguage() {
    const urlLang = window.location.pathname.replace(window.rootPath || '', '').split('/')[1];
    let language = this.props.lang || urlLang || cookie.get('jcohy_language') || siteConfig.defaultLanguage;
    // 防止链接被更改导致错误的cookie存储
    if (language !== 'en-us' && language !== 'zh-cn') {
      language = siteConfig.defaultLanguage;
    }
    // 同步cookie语言版本
    if (language !== cookie.get('jcohy_language')) {
      cookie.set('jcohy_language', language, { expires: 365 });
    }
    return language;
  }

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

  render() {
    const __html = this.props.__html || this.state.__html;
    return (
            <div
                className="doc-content markdown-body"
                ref={(node) => { this.markdownContainer = node; }}
                dangerouslySetInnerHTML={{ __html }}
            />
    );
  }
}
export default DocsItem;
