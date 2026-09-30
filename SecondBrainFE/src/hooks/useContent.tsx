// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BACKEND_URL } from '../config';

// export function useContent() {
//   const [contents, setContents] = useState<Content[]>([]);

//   // function refreshContent() {
//   //     axios.get(BACKEND_URL + '/api/v1/content', {
//   //         headers: {
//   //             "Authorization": localStorage.getItem('token')
//   //         }
//   //     }).then((response) => {
//   //       setContents(response.data.content);
//   //     })
//   // }
//   function refreshContent() {
//     axios
//       .get(BACKEND_URL + '/api/v1/content', {
//         headers: {
//           Authorization: localStorage.getItem('token'),
//         },
//       })
//       .then((response) => {
//         setContents((prev) => {
//           const server = response.data.content;

//           return server.map((srvItem: any) => {
//             const localMatch = prev.find((p) => p._id === srvItem._id);

//             // If we updated position locally, KEEP it
//             if (
//               localMatch &&
//               (localMatch.x !== srvItem.x || localMatch.y !== srvItem.y)
//             ) {
//               return { ...srvItem, x: localMatch.x, y: localMatch.y };
//             }

//             // otherwise use server value
//             return srvItem;
//           });
//         });
//       });
//   }

//   function updateContentPositionLocally(
//     contentId: string,
//     x: number,
//     y: number
//   ) {
//     setContents((prevContents: any) => {
//       return prevContents.map((content: any) => {
//         return content._id === contentId ? { ...content, x, y } : content;
//       });
//     });
//   }

//   useEffect(() => {
//     refreshContent();
//     let interval = setInterval(() => {
//       refreshContent();
//     }, 10 * 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return { contents, refreshContent, updateContentPositionLocally };
// }

import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);

  function refreshContent() {
    axios
      .get(BACKEND_URL + '/api/v1/content', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        const server = response.data.content;

        setContents((prev) => {
          if (!prev.length) return server;

          // merge logic: KEEP LOCAL X,Y if changed
          return server.map((srv) => {
            const local = prev.find((p) => p._id === srv._id);
            if (!local) return srv;

            const changed = local.x !== srv.x || local.y !== srv.y;
            return changed ? { ...srv, x: local.x, y: local.y } : srv;
          });
        });
      });
  }

  function updateContentPositionLocally(
    contentId: string,
    x: number,
    y: number
  ) {
    setContents((prev) =>
      prev.map((c) => (c._id === contentId ? { ...c, x, y } : c))
    );
  }

  useEffect(() => {
    refreshContent();

    const interval = setInterval(() => {
      refreshContent();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { contents, refreshContent, updateContentPositionLocally };
}
