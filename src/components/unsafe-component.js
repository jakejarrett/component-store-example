/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

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
class MyComponent extends React.Component
  @displayName: 'MyComponent'
  @containerStyles:
    flex: 1
    order: 2
```

Section: Component Kit
*/
let UnsafeComponent;
window.UnsafeComponent = UnsafeComponent = (function() {
  UnsafeComponent = class UnsafeComponent extends React.Component {
    constructor(...args) {
      {
        // Hack: trick Babel/TypeScript into allowing this before super.
        if (false) {
          super();
        }
        let thisFn = (() => {
          return this;
        }).toString();
        let thisName = thisFn
          .slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';'))
          .trim();
        eval(`${thisName} = this;`);
      }
      this.componentDidMount = this.componentDidMount.bind(this);
      this.componentDidUpdate = this.componentDidUpdate.bind(this);
      this.componentWillUnmount = this.componentWillUnmount.bind(this);
      this.render = this.render.bind(this);
      this.renderInjected = this.renderInjected.bind(this);
      this.unmountInjected = this.unmountInjected.bind(this);
      this.focus = this.focus.bind(this);
      this.blur = this.blur.bind(this);
      super(...args);
    }

    static initClass() {
      this.displayName = 'UnsafeComponent';

      /*
      Public: React `props` supported by UnsafeComponent:
  
       - `component` The {React.Component} to display. All other props will be
         passed on to this component.
      */
      this.propTypes = { component: React.PropTypes.func.isRequired };
    }

    componentDidMount() {
      return this.renderInjected();
    }

    componentDidUpdate() {
      return this.renderInjected();
    }

    componentWillUnmount() {
      return this.unmountInjected();
    }

    render() {
      return React.createElement('div', {
        name: 'unsafe-component-wrapper',
        style:
          this.props.component != null
            ? this.props.component.containerStyles
            : undefined,
      });
    }

    renderInjected() {
      let props;
      const node = React.findDOMNode(this);
      let element = null;
      try {
        props = _.omit(this.props, _.keys(this.constructor.propTypes));
        element = React.createElement(
          this.props.component,
          Object.assign({ key: name }, props),
        );
        this.injected = React.render(element, node);
      } catch (err) {
        console.error(err);
        let { stack } = err;
        console.log(stack);
        let stackEnd = stack.indexOf('/react/');
        if (stackEnd > 0) {
          stackEnd = stack.lastIndexOf('\n', stackEnd);
          stack = stack.substr(0, stackEnd);
        }

        element = React.createElement(
          'div',
          { className: 'unsafe-component-exception' },
          React.createElement(
            'div',
            { className: 'message' },
            this.props.component.displayName,
            ' could not be displayed.',
          ),
          React.createElement('div', { className: 'trace' }, stack),
        );
      }

      return (this.injected = React.render(element, node));
    }

    unmountInjected() {
      try {
        const node = React.findDOMNode(this);
        return React.unmountComponentAtNode(node);
      } catch (err) {}
    }

    focus() {
      // Not forwarding event - just a method call
      if (this.injected.focus != null) {
        return this.injected.focus();
      }
    }

    blur() {
      // Not forwarding an event - just a method call
      if (this.injected.blur != null) {
        return this.injected.blur();
      }
    }
  };
  UnsafeComponent.initClass();
  return UnsafeComponent;
})();
