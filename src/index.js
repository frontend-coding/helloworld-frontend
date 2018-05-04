import page from './page'
import './base.less'
import './index.less'

Q.define( function ( event ) {
  const App = event.App
  const router = event.router
  const nav = event.nav
  const Regular = event.Regular
  const fetch = event.fetch

  class TodoMVC extends App {
    start() {
      router.define( [
        {
          path: '/',
          component: page( { Regular, fetch } ),
          enter() {
            console.log( 'enter haha' )
          }
        },
      ] )
      router.start()
    }

    stop() {
      router.stop()
    }
  }

  return TodoMVC
} )
