export default function ( { Regular, fetch } ) {
  const Todo = Regular.extend( {
  	template: `
  		<li
  			class="{ todo.done ? 'completed' : '' } { editing ? 'editing' : '' }"
  			on-dblclick="{ this.onEdit() }"
  		>
  			<div class="view">
  				<input
  					class="toggle"
  					type="checkbox"
  					on-click="{ this.onToggle( todo ) }"
  					checked="{ todo.done }"
  				/>
  				<label>
  					{ todo.text }
  				</label>
  				<button class="destroy" on-click="{ this.onDelete( todo ) }"></button>
  			</div>
  			{#if editing}
  				<input
  					class="edit"
  					value="{ todo.text }"
  					on-blur="{ this.onBlur( $event ) }"
  					on-keyup="{ this.onKeyup( $event ) }"
  				/>
  			{/if}
  		</li>
  	`,
  	config() {
  		this.data.editing = false
  	},
    async init() {
      const response = await fetch( {
        url: '/',
        method: 'get',
      } )
      const json = response.data || {}
      if ( json.code === 0 ) {
        Q.toast( {
          position: 'top',
          timeout: 2000,
          type: 'info',
          square: true,
          message: '欢迎使用' + json.body.hello
        } )
      }
      Q.toast( {
        position: 'top',
        timeout: 2000,
        type: 'info',
        message: '欢迎使用该应用'
      } )
    },
    json( v ) {
      return JSON.stringify( v )
    },
    onEdit() {
      this.data.editing = true
      this.$update()
    },
    onKeyup( e ) {
      if ( e.which === 13 ) {
        e.target.blur()
      }
    },
    onBlur( e ) {
      this.data.editing = false
      this.$update()
      this.$emit( 'change', e.target.value )
    },
    onDelete( todo ) {
      this.$emit( 'delete', todo )
    },
    onToggle() {
      this.data.todo.done = !this.data.todo.done
      this.$update()
    }
  } )
  const App = Regular.extend( {
  	template: `
  		<section class="todoapp">
  			<header class="header">
  				<h1>todos</h1>
  				<input ref="input" class="new-todo" placeholder="What needs to be done?" autofocus on-keyup="{ this.onKeyup( $event ) }" />
  			</header>
  			<section class="main">
  				{#if todos.length > 0}
  				<input id="toggle-all" class="toggle-all" type="checkbox" on-click="{ this.onToggleAll() }" />
  				<label for="toggle-all">Mark all as complete</label>
  				{/if}
  				<ul class="todo-list">
  					{#list filteredTodos as todo}
  						<Todo
  							todo="{ todo }"
  							on-change="{ this.onTodoChange( todo, $event ) }"
  							on-delete="{ this.onTodoDelete( $event ) }"
  						></Todo>
  					{/list}
  				</ul>
  			</section>
  			{#if todos.length > 0}
  			<footer class="footer">
  				<span class="todo-count"><strong>{ leftCount }</strong> item left</span>
  				<ul class="filters">
  					<li>
  						<a href="javascript:;" class="{ filter === 'all' ? 'selected' : '' }" on-click="{ this.onFilter( 'all' ) }">All</a>
  					</li>
  					<li>
  						<a href="javascript:;" class="{ filter === 'active' ? 'selected' : '' }"  on-click="{ this.onFilter( 'active' ) }">Active</a>
  					</li>
  					<li>
  						<a href="javascript:;" class="{ filter === 'completed' ? 'selected' : '' }"  on-click="{ this.onFilter( 'completed' ) }">Completed</a>
  					</li>
  				</ul>
  				<button class="clear-completed" on-click="{ this.clearCompleted() }">Clear completed</button>
  			</footer>
  			{/if}
  		</section>
  	`,
  	config() {
  		this.data = {
  			todos: [],
  			filter: 'all',
  			filteredTodos: []
  		}
  	},
  	computed: {
  		leftCount() {
  			return this.data.filteredTodos.filter( todo => !todo.done ).length
  		}
  	},
    json( v ) {
      return JSON.stringify( v )
    },
    onTodoChange( todo, text ) {
      todo.text = text
      this.data.filteredTodos = doFilter( this.data.todos, this.data.filter )
      this.$update()
    },
    onTodoDelete( todo ) {
      let index
      this.data.todos.forEach( ( v, i ) => {
        if ( v === todo ) {
          index = i
        }
      } )
      this.data.todos.splice( index, 1 )
      this.data.filteredTodos = doFilter( this.data.todos, this.data.filter )
      this.$update()
    },
    onKeyup( e ) {
      if ( e.which === 13 ) {
        this.doAdd( e.target.value )
      }
    },
    onAdd() {
      this.doAdd( this._value )
    },
    doAdd( text ) {
      this.data.todos.push( {
        text: text,
        done: false
      } )
      this.data.filteredTodos = doFilter( this.data.todos, this.data.filter )
      this.$update()
      this.$refs.input.value = ''
      this.$refs.input.focus()
    },
    onToggleAll() {
      const hasUndo = this.data.todos.some( todo => !todo.done )
      this.data.todos.forEach( todo => todo.done = hasUndo )
      this.data.filteredTodos = doFilter( this.data.todos, this.data.filter )
      this.$update()
    },
    onDelete( index ) {
      this.data.todos.splice( index, 1 )
      this.$update()
    },
    onFilter( filterName ) {
      this.data.filter = filterName
      this.data.filteredTodos = doFilter( this.data.todos, this.data.filter )
      this.$update()
    },
    clearCompleted() {
      this.data.todos = this.data.todos.filter( todo => !todo.done )
      this.data.filteredTodos = doFilter( this.data.todos, this.data.filter )
      this.$update()
    }
  } )

  App.component( 'Todo', Todo )

  function doFilter( todos, filter ) {
  	switch( filter ) {
  		case 'all':
  			return todos;
  		case 'active':
  			return todos.filter( todo => !todo.done );
  		case 'completed':
  			return todos.filter( todo => todo.done );
  	}
  }

  return App
}
