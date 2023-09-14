import Markdown from '../src'

it('task', () => {
  const m = new Markdown()

  const t0 = `先看一下矩阵的显示效果:
实例：$$f(x)=x$$ 测试
# 安装与配`
  const t1 = `先看一下矩阵的显示效果:
实例：$f(x)=x$
# 安装与配`
  const t2 = `先看一下矩阵的显示效果:
实例：$$f(x)=x$
# 安装与配`
  const t3 = `先看一下矩阵的显示效果:
实例：$f(x)=x$$
# 安装与配`
  const t4 = 'aaa'

  expect(m.render(t0)).toMatchSnapshot()
  expect(m.render(t1)).toMatchSnapshot()
  expect(m.render(t2)).toMatchSnapshot()
  expect(m.render(t3)).toMatchSnapshot()
  expect(m.render(t4)).toMatchSnapshot()
})
