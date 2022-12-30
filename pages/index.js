import Head from "next/head";
import { Inter } from "@next/font/google";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  Heading,
  Center,
  Container,
  Box,
  Grid,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ launches }) {
  // console.log("launches", launches);

  return (
    <Box my={20}>
      <Container maxW="1140px" centerContent>
        <Center mb={10}>
          <Heading as="h2" size="xl">
            SpaceX Launches
          </Heading>
        </Center>
        <Grid templateColumns="repeat(3, 1fr)" gap={10}>
          {launches.map((launch) => {
            return (
              <Link
                color="teal.500"
                href={launch.links.video_link}
                target="_blank"
                key={launch.id}
                padding="4"
                border="1px solid #fff"
                transition="0.3s ease 0s"
                _hover={{ border: "1px solid #d5d5d5" }}
              >
                <Box>
                  <Image
                    boxSize="80px"
                    objectFit="cover"
                    src={launch.links.mission_patch}
                    alt={launch.mission_name}
                    mb={5}
                  />
                  <Heading as="h4" size="md" mb={2}>
                    {launch.mission_name}
                  </Heading>
                  <Text color="black" size="sm">
                    <strong>Launch Time : </strong> {launch.launch_date_local}
                  </Text>
                </Box>
              </Link>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 20) {
          id
          mission_id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `,
  });

  // console.log("data", data);

  return {
    props: {
      launches: data.launchesPast,
    },
  };
}
