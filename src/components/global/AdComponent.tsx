import React, { Component, Context, CSSProperties } from "react";
import { getLocalization } from "../../localization/localizationManager";
import { AuthContext, IUserContextType } from "../../providers/AuthContext";

interface props {
  classNames: string;
  slot: string;
  timeout: number;
  googleAdId: string;
  format?: string;
  layout?: string;
  style?: CSSProperties;
}

declare let window: any;

export default class AdComponent extends Component {
  googleInit: any = null;
  override props: props;
  static override contextType = AuthContext;
  override context!: React.ContextType<typeof AuthContext>;

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
    const { classNames, slot, googleAdId, format, layout, style } = this.props;

    return (
      <div className={classNames}>
        <p className="adtitle">
          {getLocalization(this.context.login.language, ["ads", "title"])}{" "}
          <span></span>
        </p>
        <ins
          className="adsbygoogle"
          style={style || { display: "block", textAlign: "center" }}
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
