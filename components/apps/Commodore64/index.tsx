import { memo } from "react";
import StyledCommodore64 from "components/apps/Commodore64/StyledCommodore64";
import useCommodore64 from "components/apps/Commodore64/useCommodore64";
import AppContainer from "components/system/Apps/AppContainer";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";

const Commodore64: FC<ComponentProcessProps> = ({ id }) => (
  <AppContainer
    StyledComponent={StyledCommodore64}
    id={id}
    useHook={useCommodore64}
  />
);

export default memo(Commodore64);
