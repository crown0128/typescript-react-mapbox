import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Map, Point } from 'mapbox-gl';
import {
  Anchor,
  OverlayParams,
  overlayState,
  overlayTransform,
  anchors
} from './util/overlays';
import * as GeoJSON from 'geojson';

const defaultStyle = {
  zIndex: 3
};

export interface Props {
  coordinates: GeoJSON.Position;
  anchor?: Anchor;
  offset?: number | number[] | Point;
  children?: JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  onWheel?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  className: string;
}

export interface Context {
  map: Map;
}

export default class ProjectedLayer extends React.Component<
  Props,
  OverlayParams
> {
  public context: Context;
  private container: HTMLElement;
  private prevent: boolean = false;

  public static contextTypes = {
    map: PropTypes.object
  };

  public static defaultProps = {
    anchor: anchors[0],
    offset: 0,
    // tslint:disable-next-line:no-any
    onClick: (...args: any[]) => args
  };

  public state: OverlayParams = {};

  private setContainer = (el: HTMLElement | null) => {
    if (el) {
      this.container = el;
    }
  };

  private handleMapMove = () => {
    if (!this.prevent) {
      this.setState(overlayState(this.props, this.context.map, this.container));
    }
  };

  public componentDidMount() {
    const { map } = this.context;

    map.on('move', this.handleMapMove);
    // Now this.container is rendered and the size of container is known.
    // Recalculate the anchor/position
    this.handleMapMove();
  }

  private havePropsChanged(props: Props, nextProps: Props) {
    return props.coordinates[0] !== nextProps.coordinates[0] ||
           props.coordinates[1] !== nextProps.coordinates[1] ||
           props.offset !== nextProps.offset ||
           props.anchor !== nextProps.anchor;
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.havePropsChanged(this.props, nextProps)) {
      this.setState(overlayState(nextProps, this.context.map, this.container));
    }
  }

  public componentWillUnmount() {
    const { map } = this.context;

    this.prevent = true;

    map.off('move', this.handleMapMove);
  }

  public render() {
    const {
      style,
      children,
      className,
      onClick,
      onDoubleClick,
      onMouseEnter,
      onMouseLeave,
      onScroll,
      onWheel
    } = this.props;

    const finalStyle = {
      ...defaultStyle,
      ...style,
      transform: overlayTransform(this.state).join(' ')
    };

    return (
      <div
        className={className}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onScroll={onScroll}
        onWheel={onWheel}
        style={finalStyle}
        ref={this.setContainer}
      >
        {children}
      </div>
    );
  }
}
