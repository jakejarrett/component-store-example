/*
Public: Renders a component provided via the `component` prop, and ensures that
failures in the component's code do not cause state inconsistencies elsewhere in
the application. This component is used by {InjectedComponent} and
{InjectedComponentSet} to isolate third party code that could be buggy.

Occasionally, having your component wrapped in {UnsafeComponent} can cause style
issues. For example, in a Flexbox, the `div.unsafe-component-wrapper` will cause
your `flex` and `order` values to be one level too deep. For these scenarios,
UnsafeComponent looks for `containerStyles` on your React component and attaches
them to the wrapper div:

```coffee
class MyComponent extends Component
	@displayName: 'MyComponent'
	@containerStyles:
	flex: 1
	order: 2
```

Section: Component Kit
*/
const { Component, PropTypes, findDOMNode, unmountComponentAtNode, render, createElement } = React;

window.UnsafeComponent = class UnsafeComponent extends Component {


	constructor (...args) {
		super(args);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.componentDidUpdate = this.componentDidUpdate.bind(this);
		this.componentWillUnmount = this.componentWillUnmount.bind(this);
		this.render = this.render.bind(this);
		this.renderInjected = this.renderInjected.bind(this);
		this.unmountInjected = this.unmountInjected.bind(this);
		this.focus = this.focus.bind(this);
		this.blur = this.blur.bind(this);
		this.propTypes = {
			component: PropTypes.func.isRequired
		};
	}

	static initClass () {
		this.displayName = 'UnsafeComponent';
	}

	componentDidMount () {
		return this.renderInjected();
	}

	componentDidUpdate () {
		return this.renderInjected();
	}

	componentWillUnmount () {
		return this.unmountInjected();
	}

	renderInjected () {
		let props;
		const node = findDOMNode(this);
		let element = null;
		try {
		props = _.omit(this.props, _.keys(this.propTypes));
		element = createElement(this.props.component, { ...{ key: name }, ...props });
		this.injected = render(element, node);
		} catch (err) {
		console.error(err);
		let { stack } = err;
		console.log(stack);
		let stackEnd = stack.indexOf('/react/');
		if (stackEnd > 0) {
			stackEnd = stack.lastIndexOf('\n', stackEnd);
			stack = stack.substr(0, stackEnd);
		}

		console.log();

		element = createElement(
			'div',
			{ className: 'unsafe-component-exception' },
			createElement(
			'div',
			{ className: 'message' },
			this.props.component.name,
			' could not be displayed.',
			),
			createElement('div', { className: 'trace' }, stack),
		);
		}

		return (this.injected = render(element, node));
	}

	unmountInjected () {
		try {
			const node = findDOMNode(this);
			return unmountComponentAtNode(node);
		} catch (err) {}
	}

	focus () {
		// Not forwarding event - just a method call
		if (this.injected.focus != null) {
			return this.injected.focus();
		}
	}

	blur () {
		// Not forwarding an event - just a method call
		if (this.injected.blur != null) {
			return this.injected.blur();
		}
	}

	render () {
		const style = this.props.component != null ? this.props.component.containerStyles : undefined;

		return createElement('div', {
			name: 'unsafe-component-wrapper',
			style,
		});
	}
};
