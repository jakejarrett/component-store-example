/**
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

/**
Public: InjectedComponent makes it easy to include a set of dynamically registered
components inside of your React render method. Rather than explicitly render
an array of buttons, for example, you can use InjectedComponentSet:

```coffee
<InjectedComponentSet className="message-actions"
                  matching={role: 'ThreadActionButton'}
                  exposedProps={thread:@props.thread, message:@props.message}>
```

InjectedComponentSet will look up components registered for the location you provide,
render them inside a {Flexbox} and pass them `exposedProps`. By default, all injected
children are rendered inside {UnsafeComponent} wrappers to prevent third-party code
from throwing exceptions that break React renders.

InjectedComponentSet monitors the ComponentStore for changes. If a new component
is registered into the location you provide, InjectedComponentSet will re-render.

If no matching components is found, the InjectedComponent renders an empty span.
*/
let InjectedComponentSet;
window.InjectedComponentSet = InjectedComponentSet = (function() {
  InjectedComponentSet = class InjectedComponentSet extends React.Component {
    static initClass() {
      this.displayName = 'InjectedComponentSet';

      /**
      Public: React `props` supported by InjectedComponentSet:
  
       - `matching` Pass an {Object} with ComponentStore descriptors
          This set of descriptors is provided to {ComponentStore::findComponentsForDescriptor}
          to retrieve components for display.
       - `className` (optional) A {String} class name for the containing element.
       - `children` (optional) Any React elements rendered inside the InjectedComponentSet
          will always be displayed.
       - `exposedProps` (optional) An {Object} with props that will be passed to each
          item rendered into the set.
  
       -  Any other props you provide, such as `direction`, `data-column`, etc.
          will be applied to the {Flexbox} rendered by the InjectedComponentSet.
      */
      this.propTypes = {
        matching: React.PropTypes.object.isRequired,
        children: React.PropTypes.array,
        className: React.PropTypes.string,
        exposedProps: React.PropTypes.object,
      };

      this.defaultProps = { direction: 'row' };
    }

    constructor(props) {
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.componentWillUnmount = this.componentWillUnmount.bind(this);
      this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
      this.render = this.render.bind(this);
      this._getStateFromStores = this._getStateFromStores.bind(this);
      this.props = props;
      this.state = this._getStateFromStores();
    }

    componentDidMount() {
      return (this._componentUnlistener = ComponentStore.listen(() => {
        return this.setState(this._getStateFromStores());
      }));
    }

    componentWillUnmount() {
      if (this._componentUnlistener) {
        return this._componentUnlistener();
      }
    }

    componentWillReceiveProps(newProps) {
      if (
        newProps.location !==
        (this.props != null ? this.props.location : undefined)
      ) {
        return this.setState(this._getStateFromStores(newProps));
      }
    }

    render() {
      const flexboxProps = _.omit(
        this.props,
        _.keys(this.constructor.propTypes),
      );
      let flexboxClassName =
        this.props.className != null ? this.props.className : '';
      const exposedProps =
        this.props.exposedProps != null ? this.props.exposedProps : {};

      const elements = this.state.components.map(function(Component) {
        if (Component.containerRequired === false) {
          return React.createElement(
            Component,
            Object.assign({ key: Component.displayName }, exposedProps),
          );
        } else {
          return React.createElement(
            UnsafeComponent,
            Object.assign(
              { component: Component, key: Component.displayName },
              exposedProps,
            ),
          );
        }
      });

      if (this.state.visible) {
        flexboxClassName += ' registered-region-visible';
        elements.splice(
          0,
          0,
          React.createElement(
            InjectedComponentLabel,
            Object.assign(
              { key: '_label', matching: this.props.matching },
              exposedProps,
            ),
          ),
        );
        elements.push(
          React.createElement('span', {
            key: '_clear',
            style: { clear: 'both' },
          }),
        );
      }

      return React.createElement(
        Flexbox,
        Object.assign({ className: flexboxClassName }, flexboxProps),
        elements,
        this.props.children != null ? this.props.children : [],
      );
    }

    _getStateFromStores(props) {
      if (props == null) {
        ({ props } = this);
      }

      return {
        components: ComponentStore.findComponentsMatching(this.props.matching),
        visible: ComponentStore.showComponentRegions(),
      };
    }
  };
  InjectedComponentSet.initClass();
  return InjectedComponentSet;
})();
