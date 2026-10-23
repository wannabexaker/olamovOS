import StyledCommodore64 from "components/apps/Commodore64/StyledCommodore64";
import useCommodore64 from "components/apps/Commodore64/useCommodore64";
import AppContainer, {
  useAppContainer,
} from "components/system/Apps/AppContainer";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";

const Commodore64: FC<ComponentProcessProps> = ({ id }) => {
  const containerProps = useAppContainer(id);

  useCommodore64(containerProps);

  return (
    <AppContainer {...containerProps} StyledComponent={StyledCommodore64} />
  );
};

export default Commodore64;
