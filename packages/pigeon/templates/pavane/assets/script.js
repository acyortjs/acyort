class Query {
  constructor(dom) {
    this.dom = typeof dom === 'string'
      ? document.querySelector(dom)
      : dom
  }

  removeClass(name) {
    this.dom.classList.remove(name)
    return this
  }

  html(content) {
    if (content !== undefined) {
      this.dom.innerHTML = content
      return this
    }
    return this.dom.innerHTML
  }

  attr(attribute, value) {
    if (!value) {
      return this.dom.getAttribute(attribute)
    }
    this.dom.setAttribute(attribute, value)
    return this
  }

  removeAttr(attribute) {
    this.dom.removeAttribute(attribute)
  }

  toggleClass(name) {
    this.dom.classList.toggle(name)
  }

  on(e, f) {
    this.dom.addEventListener(e, f)
  }

  css(key, value) {
    this.dom.style[key] = value
  }
}

const $ = (dom) => new Query(dom)

const checkMenu = () => {
  const { pathname } = window.location
  if (pathname !== '/' && !pathname.includes('/page/')) {
    $('.menu > a').css('display', 'block')
  } else {
    $('.menu > a').css('display', 'none')
  }
}

const posts = () => {
  let loading = false
  let prev

  return (name, initiative = true) => {
    if (loading || name === prev) {
      return
    }

    prev = name
    loading = true
    $('.menu button').attr('disabled', true)
    $('.menu > span').removeClass('active')
    $('.menu > div').removeClass('active')
    window.scrollTo(0, 0)

    window.fetch(name)
      .then((res) => res.text())
      .then((res) => {
        const title = res
          .split(/<title>([\s\S]*)<\/title>/)[1]
          .replace(/[\r\n]/g, '')
          .trim()
        const main = res.match(/<body>([\s\S]*)<\/body>/)

        const fragment = document.createElement('div');
        [fragment.innerHTML] = main

        const header = fragment.querySelector('.header')
        const content = fragment.querySelector('.content')

        document.title = title
        $('.header').html(header.innerHTML)
        $('.content').html(content.innerHTML)

        if (initiative) {
          window.history.pushState(null, title, name)
        }

        checkMenu()
      })
      .catch(({ message }) => {
        prev = undefined
        window.alert(message) // eslint-disable-line no-alert
      })
      .finally(() => {
        setTimeout(() => { $('.menu button').removeAttr('disabled') }, 1000)
        loading = false
      })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $('.menu > span').on('click', function click() {
    $(this).toggleClass('active')
    $('.menu > div').toggleClass('active')
  })

  checkMenu()

  const getPost = posts()
  $('body').on('click', (e) => {
    const { tagName } = e.target
    if (tagName !== 'A') {
      return
    }
    const href = $(e.target).attr('href')
    if (href.charAt() !== '/') {
      return
    }
    e.preventDefault()
    getPost(href)
  })

  window.addEventListener('popstate', () => {
    const { pathname } = window.location
    getPost(pathname, false)
  })
})
