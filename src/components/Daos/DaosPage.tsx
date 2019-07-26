import { DAO } from "@daostack/client";
import { getArc } from "arc";
import Loading from "components/Shared/Loading";
import Subscribe, { IObservableState } from "components/Shared/Subscribe";
import * as React from "react";
import * as Sticky from "react-stickynode";
import DaoCard from "./DaoCard";
import * as css from "./Daos.scss";

interface IProps {
  daos: DAO[];
}

class DaosPage extends React.Component<IProps, null> {

  public render() {
    const { daos } = this.props;
    const daoNodes = daos.map((dao: DAO) => {
      return (
        <DaoCard key={dao.id}  dao={dao}/>
      );
    });
    return (
      <div className={css.wrapper}>
        <Sticky enabled top={50} innerZ={10000}>
          <div className={css.daoListHeader + " clearfix"}>
            <h2 data-test-id="header-all-daos">All DAOs</h2>
          </div>
        </Sticky>
        <div className={css.daoList}>
          {daoNodes ? daoNodes : "None"}
        </div>
      </div>
    );
  }
}

export default () => {
  const arc = getArc();
  const observable = arc.daos({ where: { register: "registered" }, orderBy: "reputationHoldersCount", orderDirection: "desc"});
  return <Subscribe observable={observable}>{(state: IObservableState<DAO[]>) => {
    if (state.isLoading) {
      return (
        <div className={css.wrapper}>
          <div className={css.loading}><Loading/>
          </div>
        </div>
      );
    } else if (state.error) {
      throw state.error;
    } else {
      return <DaosPage daos={state.data} />;
    }
  }

  }</Subscribe>;
};
