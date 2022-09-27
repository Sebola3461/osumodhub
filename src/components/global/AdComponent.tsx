import React, { Component } from "react";

interface props {
  classNames: string;
  slot: string;
  timeout: number;
  googleAdId: string;
  format?: string;
  layout?: string;
}

declare let window: any;

export default class AdComponent extends Component {
  googleInit: any = null;
  override props: props;

  override componentDidMount() {
    const { timeout } = this.props;

    this.googleInit = setTimeout(() => {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }, timeout);
  }

  override componentWillUnmount() {
    if (this.googleInit) clearTimeout(this.googleInit);
  }

  override render() {
    const { classNames, slot, googleAdId, format, layout } = this.props;

    return (
      <div className={classNames}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client={googleAdId}
          data-ad-slot={slot}
          data-ad-format={format || "auto"}
          data-full-width-responsive="true"
          data-ad-layout={layout || "in-article"}
        ></ins>
      </div>
    );
  }
}
