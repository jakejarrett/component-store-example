/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
Public: A simple wrapper that provides a Flexbox layout with the given direction and style.
Any additional props you set on the Flexbox are rendered.
*/
let Flexbox;
window.Flexbox = Flexbox = (function() {
  Flexbox = class Flexbox extends React.Component {
    static initClass() {
      this.displayName = 'Flexbox';

      /*
      Public: React `props` supported by Flexbox:
  
       - `direction` (optional) A {String} Flexbox direction: either `column` or `row`.
       - `style` (optional) An {Object} with styles to apply to the flexbox.
      */
      this.propTypes = {
        direction: React.PropTypes.string,
        inline: React.PropTypes.bool,
        style: React.PropTypes.object,
      };
    }

    render() {
      const style = _.extend(this.props.style || {}, {
        flexDirection: this.props.direction,
        position: 'relative',
        display: 'flex',
        height: '100%',
      });

      if (this.props.inline === true) {
        style.display = 'inline-flex';
      }

      const otherProps = _.omit(this.props, _.keys(this.constructor.propTypes));

      return React.createElement(
        'div',
        Object.assign({ style: style }, otherProps),
        this.props.children,
      );
    }
  };
  Flexbox.initClass();
  return Flexbox;
})();
