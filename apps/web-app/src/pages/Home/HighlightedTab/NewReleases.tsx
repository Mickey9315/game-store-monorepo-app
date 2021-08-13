import { useQuery } from '@apollo/client';
import { GamesQueryParams, GamesQueryResponse } from '@game-store-monorepo/data-access';
import { getMultipleItemNames } from '@game-store-monorepo/util';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import List, { ListItem } from 'src/components/List';
import PlatformLogos from 'src/components/PlatformLogos';
import { GET_GAMES } from 'src/graphql/queries';
import { ROUTES } from 'src/routes/routes';

const queryParams: GamesQueryParams = {
  variables: {
    pageSize: 5,
    dates: '2021-01-31,2021-08-01',
    ordering: '-added',
  },
};

const NewReleases: React.FC = () => {
  const { push } = useHistory();
  const { data, loading } = useQuery<GamesQueryResponse>(GET_GAMES, queryParams);

  const listData: ListItem[] = React.useMemo(() => {
    if (!data) {
      return [];
    }
    return data.allGames.results.map((item): ListItem => {
      return {
        id: item.id,
        avatarUrl: item.thumbnailImage,
        title: item.name,
        content: (
          <div>
            <PlatformLogos data={item.parentPlatforms} className="mt-1" />
            <p className="mt-2 text-sm text-base-content-secondary truncate">{`${getMultipleItemNames(
              item.genres,
              3,
            )}`}</p>
          </div>
        ),
      };
    });
  }, [data]);

  const onItemClick = (value: ListItem) => {
    push(`${ROUTES.GAMES}/${value.id}`);
  };

  return <List data={listData} onItemClick={onItemClick} isLoading={loading} />;
};

export default NewReleases;