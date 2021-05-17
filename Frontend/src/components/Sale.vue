<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Sales</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="seeNew == 0"
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          v-if="seeNew == 0"
          @click="showNew()"
          dark
          class="mb-2"
          >Add</v-btn
        >
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Select an article</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      v-model="text"
                      @keyup.enter="articleList()"
                      class="text-xs-center"
                      append-icon="search"
                      label="Search"
                    ></v-text-field>
                    <template>
                      <v-btn
                        color="error"
                        danger
                        class="mb-2"
                        @click="removeSales()"
                        >Delete cancelled sales</v-btn
                      >
                      <v-data-table
                        :headers="headerArticles"
                        :items="articles"
                        class="elevation-1"
                      >
                        <template v-slot:items="props">
                          <td class="justify-center layout px-0">
                            <v-icon
                              small
                              class="mr-2"
                              @click="aggregateDetail(props.item)"
                            >
                              add
                            </v-icon>
                          </td>
                          <td>{{ props.item.code }}</td>
                          <td>{{ props.item.name }}</td>
                          <td>{{ props.item.categorie.name }}</td>
                          <td>{{ props.item.stock }}</td>
                          <td>{{ props.item.pvp }}</td>
                          <td>{{ props.item.description }}</td>
                          <td>
                            <div v-if="props.item.status">
                              <span class="green--text">Active</span>
                            </div>
                            <div v-else>
                              <span class="red--text">Inactive</span>
                            </div>
                          </td>
                        </template>
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAction == 1">
              Activate Sale
            </v-card-title>
            <v-card-title class="headline" v-if="adAction == 2">
              Cancel Sale
            </v-card-title>
            <v-card-text>
              You are going to <span v-if="adAction == 1">Activate </span>
              <span v-if="adAction == 2">Cancel </span> the sale {{ adName }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="activateDeactivateClose()"
                color="green darken-1"
                flat="flat"
              >
                Go back
              </v-btn>
              <v-btn
                v-if="adAction == 1"
                @click="activate()"
                color="orange darken-4"
                flat="flat"
              >
                Activate
              </v-btn>
              <v-btn
                v-if="adAction == 2"
                @click="deactivate()"
                color="orange darken-4"
                flat="flat"
              >
                Cancel Sale
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="modalProof" max-width="1000px">
          <v-card>
            <v-card-title class="headline">
              <v-btn @click="pdfCreator()"><v-icon>print</v-icon></v-btn> Sale
              proof
            </v-card-title>
            <v-card-text>
              <div id="invoice">
                <header>
                  <div id="logo">
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjIzOS4wOTYzOSIKICAgaGVpZ2h0PSIxNTIuODQ0MzYiCiAgIHZpZXdCb3g9IjAgMCA2My4yNjA5MTggNDAuNDQwMDcxIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc4IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjAuMi0yIChlODZjODcwODc5LCAyMDIxLTAxLTE1KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibG9nbzIuc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiI+CiAgICA8cmVjdAogICAgICAgeD0iODUuMjc1MzkxIgogICAgICAgeT0iMTYxLjE4Nzc3IgogICAgICAgd2lkdGg9IjQ1LjIzMDUzIgogICAgICAgaGVpZ2h0PSIxOC43MjYwMTUiCiAgICAgICBpZD0icmVjdDg2NyIgLz4KICAgIDxyZWN0CiAgICAgICB4PSI4Ny4yOTIwMzgiCiAgICAgICB5PSIxNzcuNjA5MDUiCiAgICAgICB3aWR0aD0iMjAuODg2NzA5IgogICAgICAgaGVpZ2h0PSIxNS4xMjQ4NTkiCiAgICAgICBpZD0icmVjdDg1NSIgLz4KICAgIDxyZWN0CiAgICAgICB4PSIyNy45NDQ5NzciCiAgICAgICB5PSIxNDAuNzMzMjIiCiAgICAgICB3aWR0aD0iODcuMDAzOTQ0IgogICAgICAgaGVpZ2h0PSIzOC44OTI0OTQiCiAgICAgICBpZD0icmVjdDgzNSIgLz4KICA8L2RlZnM+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJiYXNlIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnpvb209IjIuNjY4MzY1MiIKICAgICBpbmtzY2FwZTpjeD0iMTIxLjE5MTM1IgogICAgIGlua3NjYXBlOmN5PSIxMi44MzIxNjUiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InRleHRvIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXJvdGF0aW9uPSIwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICB1bml0cz0icHgiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIyNDAwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEyNzEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjIzOTEiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii05IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiIC8+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGUgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iQ2FwYSAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMuNjM2MTcyLC0xMjUuNzEwNykiPgogICAgPGcKICAgICAgIGlkPSJsb2dvIj4KICAgICAgPGcKICAgICAgICAgaWQ9InRleHRvIj4KICAgICAgICA8dGV4dAogICAgICAgICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgICAgICAgaWQ9InRleHQ4MzMiCiAgICAgICAgICAgc3R5bGU9ImZvbnQtc2l6ZToxMC41ODMzcHg7bGluZS1oZWlnaHQ6MS4yNTtmb250LWZhbWlseTonQmF1aGF1cyA5Myc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQmF1aGF1cyA5MywgTm9ybWFsJzt3aGl0ZS1zcGFjZTpwcmU7c2hhcGUtaW5zaWRlOnVybCgjcmVjdDgzNSk7Ij48dHNwYW4KICAgICAgICAgICAgIHg9IjI3Ljk0NTMxMiIKICAgICAgICAgICAgIHk9IjE1MC41MjkxOSI+PHRzcGFuCiAgICAgICAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6MTAuNTgzM3B4O2ZvbnQtZmFtaWx5OlJhbGV3YXk7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonUmFsZXdheSwgQm9sZCc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWwiPnBybzwvdHNwYW4+PHRzcGFuCiAgICAgICAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6MTAuNTgzM3B4O2ZvbnQtZmFtaWx5OlJhbGV3YXk7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonUmFsZXdheSwgQm9sZCc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7ZmlsbDojMjE5NmYzO2ZpbGwtb3BhY2l0eToxIj5RPC90c3Bhbj48dHNwYW4KICAgICAgICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjEwLjU4MzNweDtmb250LWZhbWlseTpSYWxld2F5Oy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J1JhbGV3YXksIE5vcm1hbCc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWwiPnJhdGlvPC90c3Bhbj48dHNwYW4KICAgICAgICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjEwLjU4MzNweDtmb250LWZhbWlseTonQXJpYWwgVW5pY29kZSBNUyc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQXJpYWwgVW5pY29kZSBNUywgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbCI+IDwvdHNwYW4+PC90c3Bhbj48L3RleHQ+CiAgICAgICAgPHRleHQKICAgICAgICAgICB4bWw6c3BhY2U9InByZXNlcnZlIgogICAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTo1LjAyMDkxcHg7bGluZS1oZWlnaHQ6MS4yNTtmb250LWZhbWlseTonTHVjaWRhIFNhbnMgVHlwZXdyaXRlcic7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonTHVjaWRhIFNhbnMgVHlwZXdyaXRlciwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtzdHJva2Utd2lkdGg6MC4xMjU1MjMiCiAgICAgICAgICAgeD0iNzAuMzg4IgogICAgICAgICAgIHk9IjE0Ni45NDUxMSIKICAgICAgICAgICBpZD0idGV4dDg2MSIKICAgICAgICAgICB0cmFuc2Zvcm09InNjYWxlKDEuMDQ5NjI3OCwwLjk1MjcxODY2KSI+PHRzcGFuCiAgICAgICAgICAgICBzb2RpcG9kaTpyb2xlPSJsaW5lIgogICAgICAgICAgICAgaWQ9InRzcGFuODU5IgogICAgICAgICAgICAgeD0iNzAuMzg4IgogICAgICAgICAgICAgeT0iMTQ2Ljk0NTExIgogICAgICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjUuMDIwOTFweDtmb250LWZhbWlseTonTHVjaWRhIFNhbnMgVHlwZXdyaXRlcic7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonTHVjaWRhIFNhbnMgVHlwZXdyaXRlciwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtzdHJva2Utd2lkdGg6MC4xMjU1MjMiIC8+PHRzcGFuCiAgICAgICAgICAgICBzb2RpcG9kaTpyb2xlPSJsaW5lIgogICAgICAgICAgICAgeD0iNzAuMzg4IgogICAgICAgICAgICAgeT0iMTUzLjIyMTI1IgogICAgICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjUuMDIwOTFweDtmb250LWZhbWlseTonTHVjaWRhIFNhbnMgVHlwZXdyaXRlcic7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonTHVjaWRhIFNhbnMgVHlwZXdyaXRlciwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtzdHJva2Utd2lkdGg6MC4xMjU1MjMiCiAgICAgICAgICAgICBpZD0idHNwYW44NjMiPsKpPC90c3Bhbj48L3RleHQ+CiAgICAgICAgPHRleHQKICAgICAgICAgICB4bWw6c3BhY2U9InByZXNlcnZlIgogICAgICAgICAgIGlkPSJ0ZXh0ODY1IgogICAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToxMC41ODMzcHg7bGluZS1oZWlnaHQ6MS4yNTtmb250LWZhbWlseTonQXJpYWwgUm91bmRlZCBNVCBCb2xkJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBcmlhbCBSb3VuZGVkIE1UIEJvbGQsIE5vcm1hbCc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7d2hpdGUtc3BhY2U6cHJlO3NoYXBlLWluc2lkZTp1cmwoI3JlY3Q4NjcpOyIKICAgICAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjQyOTg2MjU2LDAsMCwwLjQxOTI3NjE3LDE4LjI3Mzk2OCw4My42NTUwNTIpIj48dHNwYW4KICAgICAgICAgICAgIHg9Ijg1LjI3NTM5MSIKICAgICAgICAgICAgIHk9IjE3MC45ODQyNiI+PHRzcGFuCiAgICAgICAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToxMC41ODMzcHg7Zm9udC1mYW1pbHk6UmFsZXdheTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidSYWxld2F5LCBOb3JtYWwnO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1jYXBzOm5vcm1hbDtmb250LXZhcmlhbnQtbnVtZXJpYzpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsIj5zb2Z0d2FyZTwvdHNwYW4+PC90c3Bhbj48L3RleHQ+CiAgICAgIDwvZz4KICAgICAgPHBhdGgKICAgICAgICAgc29kaXBvZGk6dHlwZT0ic3RhciIKICAgICAgICAgc3R5bGU9ImZpbGw6IzIxOTZmMztmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzNkM2QzZDtzdHJva2Utd2lkdGg6MDtzdHJva2UtbGluZWpvaW46YmV2ZWw7c3Ryb2tlLWRhc2hhcnJheTpub25lIgogICAgICAgICBpZD0icGF0aDg0MyIKICAgICAgICAgc29kaXBvZGk6c2lkZXM9IjYiCiAgICAgICAgIHNvZGlwb2RpOmN4PSIxMzcuOTk2MzIiCiAgICAgICAgIHNvZGlwb2RpOmN5PSIxMTYuMjQ1MzQiCiAgICAgICAgIHNvZGlwb2RpOnIxPSI4LjY4NzA3NjYiCiAgICAgICAgIHNvZGlwb2RpOnIyPSI3LjUyMzIyOTYiCiAgICAgICAgIHNvZGlwb2RpOmFyZzE9IjIuNDM4MzYyIgogICAgICAgICBzb2RpcG9kaTphcmcyPSIyLjk2MTk2MDgiCiAgICAgICAgIGlua3NjYXBlOmZsYXRzaWRlZD0idHJ1ZSIKICAgICAgICAgaW5rc2NhcGU6cm91bmRlZD0iLTEuMzIiCiAgICAgICAgIGlua3NjYXBlOnJhbmRvbWl6ZWQ9IjcuMTAxIgogICAgICAgICBkPSJtIDE2Ni4xNzU5NiwxODEuNDA3NDUgYyA3LjIzOTQsMy43NTM3NiAtMTkuODIxMjQsLTYxLjI3Nzk1IC0zMy4zNDQ1MSwtNzAuMjg2MjUgLTEzLjUyMzI2LC05LjAwODI5IC0yNC4zMDE1OSwxNS40NzUzOSAtMi45NjY5NCw1MS4yMTcyOSAyMS4zMzQ2NCwzNS43NDE5IDQuMTkzMDgsLTEzNS4yNjE4NjkgMy4xNjI1OSwtMTExLjM5ODYzMyAtMS4wMzA0OSwyMy44NjMyMzUgLTYwLjk2OTEyMiw4MC40MzEzMDMgLTI0LjIyNzQ5LDkzLjUzODk4MyAzNi43NDE2NCwxMy4xMDc2OCA1MC41MTI2NSwtMTExLjE3ODk1NyAzMC4wNTQ5NCwtNzUuNzIwODk3IC0yMC40NTc3MiwzNS40NTgwNTcgMjAuMDgyMDEsMTA4Ljg5NTc0NyAyNy4zMjE0MSwxMTIuNjQ5NTA3IHoiCiAgICAgICAgIGlua3NjYXBlOnRyYW5zZm9ybS1jZW50ZXIteD0iMS4xMjc3MzE1ZS0wNiIKICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4yNjg0MzI4NSwwLDAsMC4zMDQyNDg3OCwtMTIuMzczNjA3LDExMC45MTAyMykiCiAgICAgICAgIGlua3NjYXBlOnRyYW5zZm9ybS1jZW50ZXIteT0iLTEuOTc2NTU3NWUtMDYiIC8+CiAgICA8L2c+CiAgICA8dGV4dAogICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgIGlkPSJ0ZXh0ODUzIgogICAgICAgc3R5bGU9ImZvbnQtc2l6ZToxMC41ODMzcHg7bGluZS1oZWlnaHQ6MS4yNTtmb250LWZhbWlseTonQmF1aGF1cyA5Myc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQmF1aGF1cyA5MywgTm9ybWFsJzt3aGl0ZS1zcGFjZTpwcmU7c2hhcGUtaW5zaWRlOnVybCgjcmVjdDg1NSk7IiAvPgogIDwvZz4KPC9zdmc+Cg=="
                      id="imagen"
                    />
                  </div>
                  <div id="data">
                    <p id="header">
                      <b>Materiales de Construcción La Toma</b><br />
                      Calle la Toma, 148, 29400 Ronda, Málaga<br />Phone: 952 87
                      10 59<br />Email:latoma@bigmat.es
                    </p>
                  </div>
                  <div id="fact">
                    <p>
                      {{ type_proof }}<br />
                      {{ serial_proof }}-{{ number_proof }}<br />
                      {{ moment(date).format("LL") }}
                    </p>
                  </div>
                </header>
                <br />
                <section>
                  <div>
                    <table id="faclient">
                      <tbody>
                        <tr>
                          <td id="client">
                            <strong>Mr/Mrs: {{ person.name }}</strong
                            ><br />
                            <strong>Document:</strong> {{ person.document_num
                            }}<br />
                            <strong>Address:</strong> {{ person.address }}<br />
                            <strong>Phone:</strong> {{ person.phone }}<br />
                            <strong>Email:</strong> {{ person.email }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
                <br />
                <section>
                  <div>
                    <table id="facarticle">
                      <thead>
                        <tr id="fa">
                          <th>AMOUNT</th>
                          <th>DESCRIPTION</th>
                          <th>UNIT PRICE</th>
                          <th>DISCOUNT</th>
                          <th>FINAL PRICE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="d in details" :key="d._id">
                          <td style="text-align: center">{{ d.amount }}</td>
                          <td>{{ d.article }}</td>
                          <td style="text-align: right">{{ d.price }}</td>
                          <td style="text-align: right">{{ d.discount }}</td>
                          <td style="text-align: right">
                            {{ d.amount * d.price - d.discount }}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">SUBTOTAL</th>
                          <th style="text-align: right">
                            {{ (subtotal = (total - totalTax).toFixed(2)) }}€
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">VAT({{ tax }})%</th>
                          <th style="text-align: right">
                            {{
                              (totalTax = ((total * tax) / (1 + tax)).toFixed(
                                2
                              ))
                            }}€
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">TOTAL</th>
                          <th style="text-align: right">
                            {{ (total = totalCalculator) }}€
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
                <br />
                <br />
                <footer>
                  <div id="thanks">
                    <p><b>Thank You for your business! </b></p>
                  </div>
                </footer>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="hideSaleProof()" color="blue darken-1" flat
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="sales"
        :search="search"
        class="elevation-1"
        v-if="seeNew == 0"
      >
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="seeSale(props.item)">
              info
            </v-icon>
            <v-icon small class="mr-2" @click="showSaleProof(props.item)">
              print
            </v-icon>
            <template v-if="props.item.status">
              <v-icon small @click="activateDeactivateShow(2, props.item)">
                block
              </v-icon>
            </template>
            <template v-else>
              <v-icon small @click="activateDeactivateShow(1, props.item)">
                check
              </v-icon>
            </template>
          </td>
          <td>{{ props.item.user.name }}</td>
          <td>{{ props.item.person.name }}</td>
          <td>{{ props.item.type_proof }}</td>
          <td>{{ props.item.number_proof }}</td>
          <td>{{ moment(props.item.createdAt).format("LL") }}</td>
          <td>
            <strong>{{ moment(props.item.createdAt).fromNow() }}</strong>
          </td>
          <td>{{ props.item.tax }}</td>
          <td>{{ props.item.total }}</td>
          <td>
            <div v-if="props.item.status">
              <span class="green--text">Accepted</span>
            </div>
            <div v-else>
              <span class="red--text">Cancelled</span>
            </div>
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="list()">Reset</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" v-if="seeNew">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 x14>
            <v-select
              v-model="type_proof"
              :items="documentsProof"
              label="Type Document Proof"
            >
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 x14>
            <v-text-field
              v-model="serial_proof"
              label="Serial Number"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 x14>
            <v-text-field
              v-model="number_proof"
              label="Number Document Proof"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 x18>
            <v-autocomplete :items="people" v-model="person" label="Client">
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 x14>
            <v-text-field type="number" v-model="tax" label="Tax">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 x8>
            <v-text-field
              v-model="code"
              label="Code"
              @keyup.enter="searchCode()"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 x12>
            <v-btn small fab dark color="info" @click="showModalArticles">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 x12 v-show="articleError">
            <div class="red--text" v-text="articleError"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="headerDetails"
                :items="details"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>
                    <v-icon
                      small
                      class="mr-2"
                      @click="deleteDetail(details, props.item)"
                    >
                      delete
                    </v-icon>
                  </td>
                  <td class="text-xs-center">{{ props.item.article }}</td>
                  <td class="text-xs-center">
                    <v-text-field
                      v-model="props.item.amount"
                      type="number"
                    ></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    <v-text-field
                      v-model="props.item.price"
                      type="number"
                    ></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    <v-text-field
                      v-model="props.item.discount"
                      type="number"
                    ></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    {{
                      props.item.amount * props.item.price -
                      props.item.discount
                    }}€
                  </td>
                </template>
                <template slot="no-data">
                  <h4>Any article added</h4>
                </template>
              </v-data-table>
              <v-flex class="text-xs-right">
                <strong>Subtotal:</strong>
                {{ (subtotal = (total - totalTax).toFixed(2)) }}€
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Tax:</strong>
                {{ (totalTax = ((total * tax) / (1 + tax)).toFixed(2)) }}€
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total:</strong> {{ (total = totalCalculator) }}€
              </v-flex>
            </template>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div
              class="red--text"
              v-for="v in validateMessage"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="hideNew()"
              >Cancel</v-btn
            >
            <v-btn color="info" v-if="seeDetail == 0" @click.native="save()"
              >Save</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
var moment = require("moment");
export default {
  data() {
    return {
      moment: moment,
      dialog: false,
      search: "",
      sales: [],
      headers: [
        { text: "Options", value: "options", sortable: false },
        { text: "User", value: "user.name", sortable: true },
        { text: "Client", value: "person.name", sortable: true },
        { text: "Document Proof", value: "type_proof", sortable: true },
        { text: "Number Proof", value: "number_proof", sortable: false },
        { text: "Date", value: "createdAt", sortable: false },
        { text: "", value: "serial_proof", sortable: false },
        { text: "Tax", value: "tax", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      _id: "",
      person: "",
      people: [],
      type_proof: "",
      documentsProof: ["Factura", "Ticket", "Recibo de compra", "Comprobante"],
      serial_proof: "",
      number_proof: "",
      tax: 0.21,
      code: "",
      headerDetails: [
        { text: "Delete", value: "delete", sortable: false },
        { text: "Article", value: "article", sortable: false },
        { text: "Amount", value: "amount", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Discount", value: "discount", sortable: false },
        { text: "Sub Total", value: "subtotal", sortable: false },
      ],
      details: [],
      seeNew: 0,
      articleError: null,
      total: 0,
      subtotal: 0,
      totalTax: 0,
      articles: [],
      text: "",
      headerArticles: [
        { text: "Select", value: "select", sortable: false },
        { text: "Code", value: "code", sortable: false },
        { text: "Name", value: "name", sortable: true },
        { text: "Categorie", value: "categorie.name", sortable: true },
        { text: "Stock", value: "stock", sortable: false },
        { text: "PVP", value: "pvp", sortable: false },
        { text: "Description", value: "description", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      seeDetail: 0,
      valida: 0,
      validateMessage: [],
      adModal: 0,
      adAction: 0,
      adName: "",
      adId: "",
      modalProof: 0,
      date: null,
    };
  },
  computed: {
    totalCalculator: function () {
      let result = 0.0;
      for (var i = 0; i < this.details.length; i++) {
        result =
          result +
          (this.details[i].amount * this.details[i].price -
            this.details[i].discount);
      }
      return result;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.list();
    this.selectClient();
  },
  methods: {
    /**
     * @vuese
     * Method that creates an invoice PDF document.
     */
    pdfCreator() {
      var quotes = document.getElementById("invoice");
      html2canvas(quotes).then(function (canvas) {
        var imgData = canvas.toDataURL("image/svg");
        var imgWidth = 210;
        var pageHeight = 295;

        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        var doc = new jsPDF("p", "mm", "a4");
        var position = 0;

        doc.addImage(imgData, "SVG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "SVG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save("saleProof.pdf");
      });
    },
    /**
     * @vuese
     * Method that shows the modal sale proof.
     * @arg item : Object
     */
    showSaleProof(item) {
      this.clean();
      this.type_proof = item.type_proof;
      this.serial_proof = item.serial_proof;
      this.number_proof = item.number_proof;
      this.date = item.createdAt;
      this.person = item.person;
      this.tax = item.tax;
      this.detailsList(item._id);
      this.modalProof = 1;
    },
    /**
     * @vuese
     * Method that hides the modal sale proof.
     * @arg item : Object
     */
    hideSaleProof() {
      this.modalProof = 0;
    },
    /**
     * @vuese
     * Method that selects the client which has made the sale.
     */
    selectClient() {
      let me = this;
      let arrayPeople = [];
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("person/clientList", config)
        .then(function (response) {
          arrayPeople = response.data;
          arrayPeople.map(function (x) {
            me.people.push({ text: x.name, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that searches the article its identification code.
     */
    searchCode() {
      let me = this;
      me.articleError = null;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("article/queryBarCode?code=" + this.code, config)
        .then(function (response) {
          me.aggregateDetail(response.data);
        })
        .catch(function (error) {
          me.articleError = "Article not found";
        });
    },
    /**
     * @vuese
     * Method that adds to the sale details.
     * @arg data
     */
    aggregateDetail(data) {
      this.articleError = null;
      if (this.findArticle(data._id) == true) {
        this.articleError = "The article already has been registered";
      } else {
        this.details.push({
          _id: data._id,
          article: data.name,
          amount: 1,
          price: data.pvp,
          discount: 0,
        });
        this.code = "";
      }
    },
    /**
     * @vuese
     * Method that searches an article by its identifier.
     * @arg id
     */
    findArticle(id) {
      let v = 0;
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i]._id == id) {
          v = true;
        }
      }
      return v;
    },
    /**
     * @vuese
     * Method that removes sale details.
     * @arg arr : Array
     * @arg item : Object
     */
    deleteDetail(arr, item) {
      let index = arr.indexOf(item);
      if (index != -1) {
        arr.splice(index, 1);
      }
    },
    /**
     * @vuese
     * Method that outputs a list of all the articles in the database by means of a
     * request to the API.
     */
    articleList() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("article/list?value=" + this.text, config)
        .then(function (response) {
          me.articles = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that allows you to see the details of the sale.
     * @arg id
     */
    detailsList(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("sale/query?_id=" + id, config)
        .then(function (response) {
          me.details = response.data.details;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that allows you to see the sale.
     * @arg item
     */
    seeSale(item) {
      this.clean();
      this.type_proof = item.type_proof;
      this.serial_proof = item.serial_proof;
      this.number_proof = item.number_proof;
      this.person = item.person._id;
      this.tax = item.tax;
      this.detailsList(item._id);
      this.seeNew = 1;
      this.seeDetail = 1;
    },
    /**
     * @vuese
     * Method that shows the modal of the sale.
     */
    showModalArticles() {
      this.dialog = 1;
    },
    /**
     * @vuese
     * Method that outputs a list of all the sales in the database by means of a
     * request to the API.
     */
    list() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("sale/list", config)
        .then(function (response) {
          me.sales = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that clears all selected fields.
     */
    clean() {
      this._id = "";
      this.type_proof = "";
      this.serial_proof = "";
      this.number_proof = "";
      this.tax = 0.21;
      this.code = "";
      this.total = 0;
      this.subtotal = 0;
      this.totalTax = 0;
      this.details = [];
      this.seeNew = 0;
      this.valida = 0;
      this.validateMessage = [];
      this.seeDetail = 0;
    },
    /**
     * @vuese
     * Method used to validate all the selected fields.
     */
    validator() {
      this.valida = 0;
      this.validateMessage = [];

      if (!this.person) {
        this.validateMessage.push("Select a client.");
      }
      if (!this.type_proof) {
        this.validateMessage.push("Select a type proof.");
      }
      if (!this.number_proof) {
        this.validateMessage.push("Insert a number proof");
      }
      if (!this.tax || this.tax < 0 || this.tax > 1) {
        this.validateMessage.push("Insert a valid percentage tax");
      }
      if (this.details.length <= 0) {
        this.validateMessage.push("Insert at least one article");
      }
      if (this.validateMessage.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    /**
     * @vuese
     * Method that allow to see the new sale modal window.
     */
    showNew() {
      this.seeNew = 1;
    },
    /**
     * @vuese
     * Method that allow to hide the new sale modal window.
     */
    hideNew() {
      this.seeNew = 0;
      this.clean();
    },
    /**
     * @vuese
     * Method that saves sales in the database or edits them through an API request.
     */
    save() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      if (this.validator()) {
        return;
      }
      //Save sales
      axios
        .post(
          "sale/add",
          {
            person: this.person,
            user: this.$store.state.user._id,
            type_proof: this.type_proof,
            serial_proof: this.serial_proof,
            number_proof: this.number_proof,
            tax: this.tax,
            total: this.total,
            details: this.details,
          },
          config
        )
        .then(function (response) {
          me.clean();
          me.close();
          me.list();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that displays the modal window when the user clicks on the enable or disable method.
     * @arg action:Number
     * @arg item: Object
     */
    activateDeactivateShow(accion, item) {
      this.adModal = 1;
      this.adName = item.number_proof;
      this.adId = item._id;
      if (accion == 1) {
        this.adAction = 1;
      } else if (accion == 2) {
        this.adAction = 2;
      } else {
        this.adModal = 0;
      }
    },
    /**
     * @vuese
     * Method that displays the modal window when the user clicks on the enable or disable method.
     * @arg action:Number
     * @arg item: Object
     */
    activateDeactivateClose() {
      this.adModal = 0;
    },
    /**
     * @vuese
     * Method that approbes a sale through an API query.
     */
    activate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("sale/activate", { _id: this.adId }, config)
        .then(function (response) {
          me.adModal = 0;
          me.adAction = 0;
          me.adName = "";
          me.adId = "";
          me.list();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that cancels a sale through an API query.
     */
    deactivate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("sale/deactivate", { _id: this.adId }, config)
        .then(function (response) {
          me.adModal = 0;
          me.adAction = 0;
          me.adName = "";
          me.adId = "";
          me.list();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that deletes cancelled sales.
     */
    removesales() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .delete("sale/removeSales", config)
        .then(function (response) {
          me.adModal = 0;
          me.adAction = 0;
          me.adName = "";
          me.adId = "";
          me.list();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method to close the modal window.
     */
    close() {
      this.dialog = false;
    },
  },
};
</script>