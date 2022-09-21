import { createUnionType } from '@nestjs/graphql';
import { Coffee } from 'src/coffees/entities/cofee.entity';
import { Tea } from 'src/teas/entities/tea.entity';

export const DrinksResultUnion = createUnionType({
  name: 'DrinksResult',
  types: () => [Coffee, Tea],
});
