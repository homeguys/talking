import React from 'react'
// importComponent 是使用 import()的函数
export default function asyncComponent (importComponent) {
  class AsyncComponent extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        component: null // 动态加载的组件
      }
    }
    componentDidMount() {
      importComponent().then(mod => {
        this.setState({
          // 同时兼容 ES6 和 CommonJS 的模块
          component: mod.default ? mod.default : mod
        })
      })
    }
    render () {
      // 渲染动态加载组件
      const C = this.state.component
      return C ? <C {...this.props} /> : null
    }
  }

  return AsyncComponent
}
